from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings

class InternalAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow health checks and docs without secret
        path = request.url.path
        if path in ["/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
            
        internal_secret = request.headers.get("X-Internal-Secret")
        
        if internal_secret != settings.INTERNAL_SECRET:
            raise HTTPException(
                status_code=403, 
                detail="Unauthorized internal request. Invalid Service-to-Service secret."
            )
            
        response = await call_next(request)
        return response
