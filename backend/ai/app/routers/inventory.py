from datetime import date, datetime
from typing import List

from app.core.database import get_db
from app.models.database_models import (Booking, Room, RoomAvailability,
                                        RoomInventory, User)
from app.routers.auth import get_current_user
from app.services.notification_service import NotificationService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, func
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/rooms/{room_id}/availability")
def check_room_availability(
    room_id: int,
    check_in: date,
    check_out: date,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """
    Check availability for a specific room between dates
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Get inventory
    inventory = db.query(RoomInventory).filter(RoomInventory.room_id == room_id).first()
    if not inventory:
        raise HTTPException(status_code=404, detail="Room inventory not found")

    # Check for overlapping bookings
    overlapping_bookings = db.query(func.sum(Booking.total_guests or 1)).filter(
        and_(
            Booking.room_id == room_id,
            Booking.status.in_(["confirmed", "active"]),
            or_(
                and_(Booking.check_in_date <= check_in, Booking.check_out_date > check_in),
                and_(Booking.check_in_date < check_out, Booking.check_out_date >= check_out),
                and_(Booking.check_in_date >= check_in, Booking.check_out_date <= check_out)
            )
        )
    ).scalar() or 0

    available_slots = inventory.available_slots - overlapping_bookings

    return {
        "room_id": room_id,
        "total_capacity": inventory.total_capacity,
        "available_slots": max(0, available_slots),
        "requested_dates": {
            "check_in": check_in.isoformat(),
            "check_out": check_out.isoformat()
        }
    }


@router.post("/rooms/{room_id}/book")
async def book_room(
    room_id: int,
    check_in: date,
    check_out: date,
    guests: int=1,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """
    Book a room for specific dates
    """
    # Check availability first
    availability = check_room_availability(room_id, check_in, check_out, db, current_user)

    if availability["available_slots"] < guests:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough available slots. Requested: {guests}, Available: {availability['available_slots']}"
        )

    # Create booking
    room = db.query(Room).filter(Room.id == room_id).first()
    nights = (check_out - check_in).days
    total_amount = room.monthly_price * (nights / 30) * guests  # Rough calculation

    booking = Booking(
        room_id=room_id,
        resident_id=current_user.id,
        check_in_date=check_in,
        check_out_date=check_out,
        total_guests=guests,
        total_amount=total_amount,
        status="pending"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Send notifications
    booking_details = {
        "property_name": room.property.name,
        "room_number": room.room_number,
        "check_in": check_in.isoformat(),
        "check_out": check_out.isoformat(),
        "total_amount": total_amount,
        "guests": guests
    }

    await NotificationService.send_booking_confirmation(
        user_email=current_user.email,
        user_phone=current_user.phone,
        booking_details=booking_details
    )

    return {
        "booking_id": booking.id,
        "status": "pending",
        "total_amount": total_amount,
        "message": "Booking created successfully. Payment required to confirm."
    }
