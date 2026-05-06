"""KYC (Know Your Customer) and face verification routes"""
import os
import tempfile
from typing import Optional

from app.core.database import get_db
from app.models.database_models import FaceEncodingData, KycDocument, User
from app.routers.auth import get_current_user
from app.services.face_recognition import face_recognition_service
from fastapi import (APIRouter, Depends, File, Form, HTTPException, UploadFile,
                     status)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/kyc", tags=["kyc"])

UPLOAD_DIR = "uploads/faces"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/register-face")
async def register_face_for_verification(
    file: UploadFile=File(...),
    token: str=None,
    db: Session=Depends(get_db)
):
    """
    Register user's face for portal entry verification
    This is part of the KYC process
    """
    try:
        user = get_current_user(token, db)
        
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User must be verified before registering face"
            )
        
        # Save uploaded file temporarily
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        contents = await file.read()
        temp_file.write(contents)
        temp_file.close()
        
        try:
            # Register face using the service
            success = await face_recognition_service.register_face_for_verification(
                user_id=user.id,
                image_path=temp_file.name,
                db=db
            )
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not detect face in image. Please upload a clear photo."
                )
            
            return {
                "message": "Face registered successfully for portal verification",
                "user_id": user.id
            }
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_file.name):
                os.remove(temp_file.name)
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering face: {str(e)}"
        )


@router.post("/verify-face-for-entry")
async def verify_face_for_portal_entry(
    user_id: int=Form(...),
    base64_image: str=Form(...),
    db: Session=Depends(get_db)
):
    """
    Verify user's face for portal entry
    Used during login or access control
    """
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is not verified"
            )
        
        # Verify face
        result = await face_recognition_service.verify_face_for_portal_entry(
            user_id=user_id,
            base64_image=base64_image,
            db=db
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying face: {str(e)}"
        )


@router.get("/verification-history")
async def get_face_verification_history(
    limit: int=10,
    token: str=None,
    db: Session=Depends(get_db)
):
    """
    Get user's face verification attempt history
    """
    try:
        user = get_current_user(token, db)
        
        history = await face_recognition_service.get_verification_history(
            user_id=user.id,
            db=db,
            limit=limit
        )
        
        return {
            "user_id": user.id,
            "username": user.username,
            "verification_history": history
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching verification history: {str(e)}"
        )


@router.get("/face-registered")
async def check_face_registered(
    token: str=None,
    db: Session=Depends(get_db)
):
    """
    Check if user has a registered face for portal verification
    """
    try:
        user = get_current_user(token, db)
        
        face_data = db.query(FaceEncodingData).filter(
            FaceEncodingData.user_id == user.id
        ).first()
        
        return {
            "user_id": user.id,
            "face_registered": face_data is not None,
            "message": "Face is registered for portal verification" if face_data else "No face registered yet"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking face registration: {str(e)}"
        )

# --- Admin KYC Review Endpoints ---


@router.post("/documents")
async def upload_kyc_document(
    document_type: str=Form(...),
    file: UploadFile=File(...),
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Upload KYC document for verification"""
    file_path = os.path.join(UPLOAD_DIR, f"kyc_{current_user.id}_{file.filename}")
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    kyc_doc = KycDocument(
        user_id=current_user.id,
        document_type=document_type,
        file_path=file_path,
        status="pending"
    )

    db.add(kyc_doc)
    db.commit()
    db.refresh(kyc_doc)

    return {"document_id": kyc_doc.id, "status": "pending"}


@router.get("/documents/pending")
def get_pending_documents(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Get pending KYC documents (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")

    documents = db.query(KycDocument).filter(KycDocument.status == "pending").all()
    return {"documents": documents}


@router.put("/documents/{document_id}/review")
def review_kyc_document(
    document_id: int,
    status: str,  # approved or rejected
    review_notes: Optional[str]=None,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Review KYC document (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")

    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    document = db.query(KycDocument).filter(KycDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    document.status = status
    document.reviewed_by = current_user.id
    document.review_notes = review_notes
    db.commit()

    # Update user verification status if approved
    if status == "approved":
        user = db.query(User).filter(User.id == document.user_id).first()
        user.is_verified = True
        db.commit()

    return {"message": f"Document {status} successfully"}
