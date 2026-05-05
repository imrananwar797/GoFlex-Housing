"""Payment and Stripe schemas"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class PaymentStatus(str, Enum):
    """Payment status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentIntentRequest(BaseModel):
    """Create payment intent request"""
    booking_id: int
    amount: float = Field(..., gt=0)
    currency: str = "usd"

class PaymentIntentResponse(BaseModel):
    """Payment intent response"""
    client_secret: str
    payment_intent_id: str
    amount: float
    currency: str

class StripeWebhookEvent(BaseModel):
    """Stripe webhook event"""
    id: str
    type: str
    data: dict

class PaymentTransaction(BaseModel):
    """Payment transaction schema"""
    id: int
    booking_id: int
    stripe_payment_id: str
    amount: float
    currency: str
    status: PaymentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BookingPaymentRequest(BaseModel):
    """Booking payment request"""
    booking_id: int
    payment_method: str  # "stripe", "upi", "card"

class RefundRequest(BaseModel):
    """Refund request"""
    transaction_id: int
    reason: Optional[str] = None

class RefundResponse(BaseModel):
    """Refund response"""
    refund_id: str
    amount: float
    status: str
    created_at: datetime
