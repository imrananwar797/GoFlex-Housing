from app.core.config import settings
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    """Upload a file to S3 (Mock)"""
    if not settings.AWS_S3_BUCKET:
        # Fallback to local storage or mock
        return {
            "status": "success",
            "url": f"/uploads/{file.filename}",
            "message": "Stored locally (S3 not configured)"
        }
        
    # Mock S3 upload logic
    s3_url = f"https://{settings.AWS_S3_BUCKET}.s3.amazonaws.com/{current_user.id}/{file.filename}"
    return {
        "status": "success",
        "url": s3_url,
        "message": "Successfully uploaded to S3"
    }


@router.get("/signed-url")
async def get_signed_url(
    filename: str,
    current_user=Depends(get_current_user)
):
    """Generate a pre-signed URL for direct S3 upload"""
    if not settings.AWS_S3_BUCKET:
        raise HTTPException(status_code=500, detail="S3 is not configured")
        
    # Mock pre-signed URL generation
    return {
        "url": f"https://{settings.AWS_S3_BUCKET}.s3.amazonaws.com/{current_user.id}/{filename}?AWSAccessKeyId=mock&Expires=12345&Signature=mock",
        "method": "PUT"
    }
