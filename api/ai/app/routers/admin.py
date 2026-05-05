from typing import List

from app.core.database import get_db
from app.models.database_models import Booking, Property
from app.models.database_models import User
from app.models.database_models import User as UserModel
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/users")
def list_users(
    skip: int=0,
    limit: int=100,
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """List all users (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    users = db.query(User).offset(skip).limit(limit).all()
    return {"users": users, "total": len(users)}


@router.put("/users/{user_id}/suspend")
def suspend_user(
    user_id: int,
    suspended: bool,
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Suspend or unsuspend a user (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = not suspended
    db.commit()

    return {"message": f"User {'suspended' if suspended else 'unsuspended'} successfully"}


@router.get("/stats")
def get_platform_stats(
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Get platform statistics (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    total_users = db.query(func.count(User.id)).scalar()
    total_properties = db.query(func.count(Property.id)).scalar()
    total_bookings = db.query(func.count(Booking.id)).scalar()
    total_revenue = db.query(func.sum(Booking.total_amount)).filter(Booking.status == "confirmed").scalar() or 0

    return {
        "total_users": total_users,
        "total_properties": total_properties,
        "total_bookings": total_bookings,
        "total_revenue": total_revenue
    }
