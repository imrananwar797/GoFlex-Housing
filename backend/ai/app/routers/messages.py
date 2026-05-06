import logging

from app.core.database import get_db
from app.models.database_models import User
from app.models.messaging_models import (Conversation, ConversationParticipant,
                                         Message)
from app.routers.auth import get_current_user
from app.services.socket_manager import notify_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/conversations")
def create_conversation(
    participant_id: int,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    current_user_id = current_user.id
    
    # Check if participant exists
    participant = db.query(User).filter(User.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    # Prevent self-messaging
    if current_user_id == participant_id:
        raise HTTPException(status_code=400, detail="Cannot create conversation with yourself")
    
    # Find existing conversation between these two users
    # Get conversations where current user is a participant
    user_conversations = db.query(ConversationParticipant.conversation_id).filter(
        ConversationParticipant.user_id == current_user_id
    ).subquery()
    
    # Find conversations where both users are participants
    existing_conversation = db.query(ConversationParticipant.conversation_id).filter(
        ConversationParticipant.conversation_id.in_(user_conversations),
        ConversationParticipant.user_id == participant_id
    ).first()
    
    if existing_conversation:
        return {"conversation_id": existing_conversation.conversation_id}
    
    # Create new conversation
    new_conv = Conversation()
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    
    # Add participants
    p1 = ConversationParticipant(conversation_id=new_conv.id, user_id=current_user_id)
    p2 = ConversationParticipant(conversation_id=new_conv.id, user_id=participant_id)
    db.add_all([p1, p2])
    db.commit()
    
    return {"conversation_id": new_conv.id}


@router.post("/messages")
async def send_message(
    conversation_id: int,
    content: str,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    current_user_id = current_user.id
    # 1. Save to DB
    new_msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user_id,
        content=content
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    
    # 2. Notify recipient via WebSocket
    # Find the other user in this conversation
    participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id != current_user_id
    ).first()
    
    if participant:
        await notify_user(participant.user_id, "new_message", {
            "id": new_msg.id,
            "content": new_msg.content,
            "sender_id": current_user_id
        })
    
    return new_msg
