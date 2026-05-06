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
    from app.models.database_models import Resident

    # 1. Resolve resident profile
    resident_profile = db.query(Resident).filter(Resident.user_id == current_user.id).first()
    
    # 2. Active booking
    active_booking = None
    if resident_profile:
        active_booking = db.query(Booking).filter(
            Booking.resident_id == resident_profile.id,
            Booking.status.in_(["confirmed", "active"])
        ).first()

    # 3. Recent payments (Using the user_id column we added to PaymentTransaction)
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
@router.get("/owner")
def get_owner_dashboard(
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Get dashboard analytics for property owners"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    # 1. Resolve owner profile
    from app.models.database_models import Owner, Resident
    owner_profile = db.query(Owner).filter(Owner.user_id == current_user.id).first()
    if not owner_profile:
        return {
            "stats": {"total_revenue": 0, "active_residents": 0, "occupancy_rate": 0, "total_bookings": 0},
            "recent_bookings": []
        }

    # 2. Get owner's properties
    owner_properties = db.query(Property.id).filter(Property.owner_id == owner_profile.id).all()
    property_ids = [p.id for p in owner_properties]

    if not property_ids:
        return {
            "stats": {"total_revenue": 0, "active_residents": 0, "occupancy_rate": 0, "total_bookings": 0},
            "recent_bookings": []
        }

    # 3. Revenue
    total_revenue = db.query(func.sum(PaymentTransaction.amount)).join(Booking).filter(
        Booking.property_id.in_(property_ids),
        PaymentTransaction.status == "completed"
    ).scalar() or 0

    # 4. Residents (Using resident_id from Booking)
    active_residents = db.query(func.count(func.distinct(Booking.resident_id))).filter(
        Booking.property_id.in_(property_ids),
        Booking.status.in_(["confirmed", "active"])
    ).scalar() or 0

    # 5. Occupancy
    total_beds = db.query(func.sum(Property.beds)).filter(Property.id.in_(property_ids)).scalar() or 1
    occupancy_rate = (active_residents / total_beds) * 100 if total_beds > 0 else 0

    # 6. Recent activity
    recent_bookings = db.query(Booking).filter(
        Booking.property_id.in_(property_ids)
    ).order_by(Booking.created_at.desc()).limit(5).all()

    return {
        "stats": {
            "total_revenue": total_revenue,
            "active_residents": active_residents,
            "occupancy_rate": occupancy_rate,
            "total_bookings": db.query(func.count(Booking.id)).filter(Booking.property_id.in_(property_ids)).scalar() or 0
        },
        "recent_bookings": recent_bookings
    }
@router.get("/owner/property/{property_id}")
def get_owner_property_analytics(
    property_id: int,
    db: Session=Depends(get_db),
    current_user: UserModel=Depends(get_current_user)
):
    """Get analytics for a specific property owned by the current user"""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")

    from app.models.database_models import Owner, Resident
    owner_profile = db.query(Owner).filter(Owner.user_id == current_user.id).first()
    if not owner_profile:
        raise HTTPException(status_code=404, detail="Owner profile not found")

    # Verify ownership
    property_obj = db.query(Property).filter(
        Property.id == property_id,
        Property.owner_id == owner_profile.id
    ).first()
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found or access denied")

    # 1. Revenue stats
    total_revenue = db.query(func.sum(PaymentTransaction.amount)).join(Booking).filter(
        Booking.property_id == property_id,
        PaymentTransaction.status == "completed"
    ).scalar() or 0

    # 2. Occupancy stats
    active_residents = db.query(func.count(func.distinct(Booking.resident_id))).filter(
        Booking.property_id == property_id,
        Booking.status.in_(["confirmed", "active"])
    ).scalar() or 0
    
    occupancy_rate = (active_residents / property_obj.beds) * 100 if property_obj.beds > 0 else 0

    # 3. Monthly revenue trend (last 6 months)
    revenue_trend = db.query(
        extract('month', PaymentTransaction.created_at).label('month'),
        func.sum(PaymentTransaction.amount).label('amount')
    ).join(Booking).filter(
        Booking.property_id == property_id,
        PaymentTransaction.status == "completed",
        PaymentTransaction.created_at >= datetime.now() - timedelta(days=180)
    ).group_by(extract('month', PaymentTransaction.created_at)).all()

    # 4. Recent transactions
    recent_transactions = db.query(PaymentTransaction).join(Booking).filter(
        Booking.property_id == property_id
    ).order_by(PaymentTransaction.created_at.desc()).limit(10).all()

    return {
        "property": property_obj,
        "stats": {
            "total_revenue": total_revenue,
            "active_residents": active_residents,
            "occupancy_rate": occupancy_rate
        },
        "revenue_trend": [{"month": int(r.month), "amount": r.amount} for r in revenue_trend],
        "recent_transactions": recent_transactions
    }
