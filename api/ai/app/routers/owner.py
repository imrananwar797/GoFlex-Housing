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

    from app.models.database_models import Owner
    owner_profile = db.query(Owner).filter(Owner.user_id == current_user.id).first()
    if not owner_profile:
        return {"properties": []}

    properties = db.query(Property).filter(Property.owner_id == owner_profile.id).all()
    return {"properties": properties}


@router.get("/bookings")
def list_owner_bookings(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """List bookings for owner's properties"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    from app.models.database_models import Owner
    owner_profile = db.query(Owner).filter(Owner.user_id == current_user.id).first()
    if not owner_profile:
        return {"bookings": []}

    # Get all bookings for properties owned by this user
    bookings = db.query(Booking).join(Property).filter(Property.owner_id == owner_profile.id).all()
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
@router.get("/residents")
def list_owner_residents(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """List all unique residents across owner's properties"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    from app.models.database_models import Owner, Resident
    owner_profile = db.query(Owner).filter(Owner.user_id == current_user.id).first()
    if not owner_profile:
        return {"data": []}

    residents = db.query(User).join(Resident).join(Booking).join(Property).filter(
        Property.owner_id == owner_profile.id,
        Booking.status.in_(["confirmed", "active"])
    ).distinct().all()

    # Enhance resident data with property info
    result = []
    for resident in residents:
        active_booking = db.query(Booking).join(Property).filter(
            Booking.resident_id == resident.resident_profile.id,
            Property.owner_id == owner_profile.id,
            Booking.status.in_(["confirmed", "active"])
        ).first()
        
        result.append({
            "id": resident.id,
            "username": resident.username,
            "full_name": resident.full_name,
            "email": resident.email,
            "property_name": active_booking.property.name if active_booking else "N/A",
            "booking_id": active_booking.id if active_booking else None
        })

    return {"data": result}


from app.schemas.payment_schemas import IssueBillRequest

@router.post("/issue-bill")
def issue_resident_bill(
    payload: IssueBillRequest,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Issue a manual bill to a resident for a booking"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    booking = db.query(Booking).join(Property).filter(
        Booking.id == payload.booking_id,
        Property.owner_id == current_user.id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or access denied")

    from app.models.database_models import PaymentTransaction
    import uuid

    # In database_models.py, Booking has resident_id (points to Resident profile)
    # Resident has user_id. We want the user_id for the transaction.
    resident_user_id = booking.resident.user_id if booking.resident else None

    bill = PaymentTransaction(
        booking_id=payload.booking_id,
        user_id=resident_user_id,
        amount=payload.amount,
        status="pending",
        stripe_payment_id=f"bill_{uuid.uuid4().hex[:8]}"
    )

    db.add(bill)
    db.commit()
    db.refresh(bill)

    return {"message": "Bill issued successfully", "bill_id": bill.id}
