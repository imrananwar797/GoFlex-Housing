from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import os

INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "goflex-internal-m2m-secret")

class InternalAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow health checks without secret
        if request.url.path == "/health":
            return await call_next(request)
            
        internal_secret = request.headers.get("X-Internal-Secret")
        
        if internal_secret != INTERNAL_SECRET:
            raise HTTPException(
                status_code=403, 
                detail="Unauthorized internal request. Invalid Service-to-Service secret."
            )
            
        response = await call_next(request)
        return response
