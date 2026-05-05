import os
from typing import List

from app.core.database import get_db
from app.models.database_models import Booking, Property, User
from app.routers.auth import get_current_user
from app.schemas.property_schemas import PropertyCreate
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

router = APIRouter()

UPLOAD_DIR = "uploads/properties"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/properties")
def create_property(
    property_data: PropertyCreate,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Create a new property (Owner only)"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    new_property = Property(
        owner_id=current_user.id,
        name=property_data.name,
        description=property_data.description,
        city=property_data.city,
        state=property_data.state,
        address=property_data.address,
        monthly_price=property_data.monthly_price,
        beds=property_data.beds,
        baths=property_data.baths,
        amenities=property_data.amenities
    )

    db.add(new_property)
    db.commit()
    db.refresh(new_property)

    return {"property_id": new_property.id, "message": "Property created successfully"}


@router.get("/properties")
def list_owner_properties(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """List properties owned by current user"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    properties = db.query(Property).filter(Property.owner_id == current_user.id).all()
    return {"properties": properties}


@router.get("/bookings")
def list_owner_bookings(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """List bookings for owner's properties"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    # Get all bookings for properties owned by this user
    bookings = db.query(Booking).join(Property).filter(Property.owner_id == current_user.id).all()
    return {"bookings": bookings}


@router.post("/properties/{property_id}/images")
async def upload_property_images(
    property_id: int,
    files: List[UploadFile]=File(...),
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Upload images for a property (Owner only)"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    property = db.query(Property).filter(
        Property.id == property_id,
        Property.owner_id == current_user.id
    ).first()

    if not property:
        raise HTTPException(status_code=404, detail="Property not found or access denied")

    uploaded_files = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, f"{property_id}_{file.filename}")
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        uploaded_files.append(file_path)

    # Update property with image paths (you might want to store in DB)
    if not property.featured_image and uploaded_files:
        property.featured_image = uploaded_files[0]
        db.commit()

    return {"uploaded": uploaded_files}
