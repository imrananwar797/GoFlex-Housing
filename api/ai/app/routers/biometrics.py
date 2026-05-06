import asyncio
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LivenessRequest(BaseModel):
    user_id: int = None
    document_url: str = None
    document_type: str = None

@router.post('/liveness')
async def verify_liveness(request: LivenessRequest):
    # Simulate 2 seconds of deep AI processing to wow the user workflow
    await asyncio.sleep(2)
    return {'status': 'verified', 'risk_score': 0.98, 'message': 'Mock AI verification successful'}
