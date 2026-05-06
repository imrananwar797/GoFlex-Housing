from datetime import datetime
from typing import List, Optional

from app.core.database import get_db
from app.models.database_models import Booking, Property, User
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, not_, or_
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/properties")
def search_properties(
    city: Optional[str]=Query(None, description="City to search in"),
    state: Optional[str]=Query(None, description="State to search in"),
    min_price: Optional[float]=Query(None, description="Minimum monthly price"),
    max_price: Optional[float]=Query(None, description="Maximum monthly price"),
    amenities: Optional[List[str]]=Query(None, description="Required amenities"),
    check_in: Optional[datetime]=Query(None, description="Check-in date"),
    check_out: Optional[datetime]=Query(None, description="Check-out date"),
    beds: Optional[int]=Query(None, description="Minimum number of beds"),
    baths: Optional[int]=Query(None, description="Minimum number of baths"),
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """
    Advanced search for properties with filters
    """
    query = db.query(Property).filter(Property.active == True)

    # Location filters
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if state:
        query = query.filter(Property.state.ilike(f"%{state}%"))

    # Price filters
    if min_price is not None:
        query = query.filter(Property.monthly_price >= min_price)
    if max_price is not None:
        query = query.filter(Property.monthly_price <= max_price)

    # Amenities filter (JSON array contains)
    if amenities:
        for amenity in amenities:
            query = query.filter(Property.amenities.contains([amenity]))

    # Beds and baths
    if beds is not None:
        query = query.filter(Property.beds >= beds)
    if baths is not None:
        query = query.filter(Property.baths >= baths)

    # Availability filter - check for overlapping bookings
    if check_in and check_out:
        # Find properties that don't have bookings overlapping with the requested dates
        overlapping_bookings = db.query(Booking.property_id).filter(
            and_(
                Booking.status.in_(["confirmed", "active"]),
                or_(
                    and_(Booking.check_in_date <= check_in, Booking.check_out_date > check_in),
                    and_(Booking.check_in_date < check_out, Booking.check_out_date >= check_out),
                    and_(Booking.check_in_date >= check_in, Booking.check_out_date <= check_out)
                )
            )
        ).subquery()

        query = query.filter(not_(Property.id.in_(overlapping_bookings)))

    properties = query.all()

    # Convert to dict and include availability info
    result = []
    for prop in properties:
        prop_dict = {
            "id": prop.id,
            "name": prop.name,
            "description": prop.description,
            "city": prop.city,
            "state": prop.state,
            "monthly_price": prop.monthly_price,
            "beds": prop.beds,
            "baths": prop.baths,
            "amenities": prop.amenities,
            "featured_image": prop.featured_image,
            "verified": prop.verified,
            "available": True  # Since we filtered for availability
        }
        result.append(prop_dict)

    return {"properties": result, "total": len(result)}
