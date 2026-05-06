from app.core.database import get_db
from app.models.database_models import UserRole
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/matterport/{property_id}")
async def get_matterport_tour(
    property_id: int,
    db: Session = Depends(get_db)
):
    """Get Matterport 3D tour details for a property"""
    # This is a mock response. In a real app, this would fetch the actual tour ID
    return {
        "property_id": property_id,
        "tour_url": f"https://my.matterport.com/show/?m=mock_tour_id_{property_id}",
        "status": "active"
    }


@router.post("/process/{video_id}")
async def process_video(
    video_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Process a video using AWS MediaConvert (mock)"""
    if current_user.role not in [UserRole.ADMIN, UserRole.OWNER]:
        raise HTTPException(status_code=403, detail="Not authorized to process videos")
        
    return {
        "video_id": video_id,
        "job_id": f"job_{video_id}",
        "status": "processing",
        "message": "Video transcoding job initiated via AWS MediaConvert"
    }
