from typing import List

from app.core.database import get_db
from app.models.database_models import Booking, PaymentTransaction
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()


class PaymentRequest(BaseModel):
    booking_id: int
    amount: float
    method: str  # upi, netbanking, wallet, stripe


@router.get("/methods")
async def get_payment_methods():
    """Get available payment methods"""
    return {
        "methods": [
            {"id": "stripe", "name": "Credit/Debit Card", "icon": "card"},
            {"id": "upi", "name": "UPI", "icon": "upi"},
            {"id": "netbanking", "name": "Net Banking", "icon": "bank"},
            {"id": "wallet", "name": "Digital Wallet", "icon": "wallet"}
        ]
    }


@router.post("/initiate")
async def initiate_payment(
    request: PaymentRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Initiate a generic payment transaction"""
    booking = db.query(Booking).filter(Booking.id == request.booking_id, Booking.resident_id == current_user.resident_profile.id if current_user.resident_profile else -1).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # This is a mock implementation. In a real application, you would integrate
    # with Razorpay (for UPI/Netbanking) or Stripe or PayPal here.
    
    transaction = PaymentTransaction(
        booking_id=request.booking_id,
        amount=request.amount,
        stripe_payment_id=f"mock_{request.method}_{current_user.id}_{booking.id}",
        status="processing"
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return {
        "transaction_id": transaction.id,
        "payment_method": request.method,
        "status": "processing",
        "gateway_url": f"https://mock-gateway.com/pay/{transaction.stripe_payment_id}"
    }


@router.post("/callback/{transaction_id}")
async def payment_callback(
    transaction_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """Callback for external payment gateways"""
    transaction = db.query(PaymentTransaction).filter(PaymentTransaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    transaction.status = status
    
    if status == "completed":
        booking = db.query(Booking).filter(Booking.id == transaction.booking_id).first()
        if booking:
            booking.payment_status = "paid"
            
    db.commit()
    return {"status": "updated", "transaction": transaction.status}
