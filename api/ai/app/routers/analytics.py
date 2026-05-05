from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.database_models import Booking, PaymentTransaction, Property
from app.models.database_models import User
from app.models.database_models import User as UserModel
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/dashboard")
def get_analytics_dashboard(
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Get comprehensive analytics dashboard (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    # User stats
    total_users = db.query(func.count(User.id)).scalar()
    new_users_this_month = db.query(func.count(User.id)).filter(
        extract('month', User.created_at) == datetime.now().month,
        extract('year', User.created_at) == datetime.now().year
    ).scalar()

    # Property stats
    total_properties = db.query(func.count(Property.id)).scalar()
    active_properties = db.query(func.count(Property.id)).filter(Property.active == True).scalar()

    # Booking stats
    total_bookings = db.query(func.count(Booking.id)).scalar()
    confirmed_bookings = db.query(func.count(Booking.id)).filter(Booking.status == "confirmed").scalar()

    # Revenue stats
    total_revenue = db.query(func.sum(PaymentTransaction.amount)).filter(
        PaymentTransaction.status == "completed"
    ).scalar() or 0

    revenue_this_month = db.query(func.sum(PaymentTransaction.amount)).filter(
        PaymentTransaction.status == "completed",
        extract('month', PaymentTransaction.created_at) == datetime.now().month,
        extract('year', PaymentTransaction.created_at) == datetime.now().year
    ).scalar() or 0

    # Occupancy rate (simplified)
    total_rooms = db.query(func.sum(Property.beds)).scalar() or 1
    occupied_rooms = db.query(func.count(Booking.id)).filter(
        Booking.status == "active",
        Booking.check_in_date <= datetime.now(),
        Booking.check_out_date >= datetime.now()
    ).scalar()

    occupancy_rate = (occupied_rooms / total_rooms) * 100 if total_rooms > 0 else 0

    return {
        "users": {
            "total": total_users,
            "new_this_month": new_users_this_month
        },
        "properties": {
            "total": total_properties,
            "active": active_properties
        },
        "bookings": {
            "total": total_bookings,
            "confirmed": confirmed_bookings
        },
        "revenue": {
            "total": total_revenue,
            "this_month": revenue_this_month
        },
        "occupancy_rate": occupancy_rate
    }


@router.get("/revenue-chart")
def get_revenue_chart(
    days: int=30,
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Get revenue data for charts (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    start_date = datetime.now() - timedelta(days=days)

    # Daily revenue
    revenue_data = db.query(
        func.date(PaymentTransaction.created_at).label('date'),
        func.sum(PaymentTransaction.amount).label('revenue')
    ).filter(
        PaymentTransaction.status == "completed",
        PaymentTransaction.created_at >= start_date
    ).group_by(func.date(PaymentTransaction.created_at)).all()

    return {"revenue_chart": [{"date": str(r.date), "revenue": r.revenue} for r in revenue_data]}


@router.get("/resident")
def get_resident_dashboard(
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Get resident-specific dashboard data"""
    # Active booking
    active_booking = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.status == "confirmed"
    ).first()

    # Recent payments
    recent_payments = db.query(PaymentTransaction).filter(
        PaymentTransaction.user_id == current_user.id
    ).order_by(PaymentTransaction.created_at.desc()).limit(5).all()

    return {
        "active_booking": active_booking,
        "recent_payments": recent_payments,
        "stats": {
            "total_spent": db.query(func.sum(PaymentTransaction.amount)).filter(
                PaymentTransaction.user_id == current_user.id,
                PaymentTransaction.status == "completed"
            ).scalar() or 0
        }
    }
