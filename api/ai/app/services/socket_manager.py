import json
import logging
from typing import Dict, List

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    redis = None
    REDIS_AVAILABLE = False
import socketio
from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_token
from app.models.database_models import User
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Create the Socket.IO server (ASGI mode)
# cors_allowed_origins='*' allows the React frontend to connect
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Redis client for storing socket connections
redis_client = None
if REDIS_AVAILABLE and settings.REDIS_URL:
    redis_client = redis.from_url(settings.REDIS_URL)

# Fallback in-memory storage (only for single-process development)
user_sockets: Dict[str, List[str]] = {}


def get_user_sockets(user_id: str) -> List[str]:
    """Get socket IDs for a user from Redis or memory"""
    if REDIS_AVAILABLE and redis_client:
        sockets_data = redis_client.get(f"user_sockets:{user_id}")
        return json.loads(sockets_data) if sockets_data else []
    else:
        return user_sockets.get(user_id, [])


def add_user_socket(user_id: str, socket_id: str):
    """Add a socket ID for a user"""
    if REDIS_AVAILABLE and redis_client:
        sockets = get_user_sockets(user_id)
        if socket_id not in sockets:
            sockets.append(socket_id)
            redis_client.set(f"user_sockets:{user_id}", json.dumps(sockets))
            # Add reverse mapping for O(1) lookup on disconnect
            redis_client.set(f"socket_user:{socket_id}", user_id)
    else:
        if user_id not in user_sockets:
            user_sockets[user_id] = []
        if socket_id not in user_sockets[user_id]:
            user_sockets[user_id].append(socket_id)


def remove_user_socket(user_id: str, socket_id: str):
    """Remove a socket ID for a user"""
    if REDIS_AVAILABLE and redis_client:
        sockets = get_user_sockets(user_id)
        if socket_id in sockets:
            sockets.remove(socket_id)
            if sockets:
                redis_client.set(f"user_sockets:{user_id}", json.dumps(sockets))
            else:
                redis_client.delete(f"user_sockets:{user_id}")
            # Clean up reverse mapping
            redis_client.delete(f"socket_user:{socket_id}")
    else:
        if user_id in user_sockets and socket_id in user_sockets[user_id]:
            user_sockets[user_id].remove(socket_id)
            if not user_sockets[user_id]:
                del user_sockets[user_id]


@sio.event
async def connect(sid, environ, auth):
    """
    Handle new socket connection.
    Expects auth token in handshake: socket = io({ auth: { token: "..." } })
    """
    if not auth or 'token' not in auth:
        raise socketio.ConnectionRefusedError('Authentication failed: No token provided')
    
    token = auth['token']
    payload = decode_token(token)
    if not payload:
        raise socketio.ConnectionRefusedError('Authentication failed: Invalid token')
    
    username = payload.get("sub")
    if not username:
        raise socketio.ConnectionRefusedError('Authentication failed: No username in token')
    
    # Get user from DB
    db: Session = next(get_db())
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise socketio.ConnectionRefusedError('Authentication failed: User not found')
    
    user_id = str(user.id)
    logger.info(f"User {user_id} connected with SID {sid}")
    
    # Register socket
    add_user_socket(user_id, sid)
    
    # Join a private room for this user
    await sio.enter_room(sid, f"user_{user_id}")


@sio.event
async def disconnect(sid):
    # Find user_id for this sid and remove it
    if REDIS_AVAILABLE and redis_client:
        # O(1) lookup using reverse mapping
        user_id_bytes = redis_client.get(f"socket_user:{sid}")
        if user_id_bytes:
            user_id = user_id_bytes.decode()
            remove_user_socket(user_id, sid)
            logger.info(f"User {user_id} disconnected (SID: {sid})")
    else:
        # Fallback to in-memory
        for user_id, sids in user_sockets.items():
            if sid in sids:
                remove_user_socket(user_id, sid)
                logger.info(f"User {user_id} disconnected (SID: {sid})")
                break


async def notify_user(user_id: int, event_type: str, data: dict):
    """Send a real-time notification to a specific user"""
    room = f"user_{user_id}"
    await sio.emit(event_type, data, room=room)


async def notify_property_update(property_id: int, data: dict):
    """Broadcast update to anyone looking at this property"""
    await sio.emit('property_updated', data, room=f"property_{property_id}")


# This wraps the socket app as an ASGI app
socket_app = socketio.ASGIApp(sio)
