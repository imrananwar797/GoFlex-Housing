"""Stripe payment service"""
import stripe
import logging
from typing import Optional, Dict, Any
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.database_models import PaymentTransaction, Booking, User
from app.services.email_service import email_service
from datetime import datetime

logger = logging.getLogger(__name__)

# Initialize Stripe API
stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    """Service for handling Stripe payments"""
    
    @staticmethod
    def create_payment_intent(booking_id: int, amount: float, currency: str = "usd", db: Session = None) -> Dict[str, Any]:
        """Create a Stripe payment intent"""
        try:
            # Create payment intent
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe uses cents
                currency=currency,
                metadata={
                    "booking_id": booking_id,
                }
            )
            
            return {
                "success": True,
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
                "amount": amount,
                "currency": currency,
            }
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error creating payment intent: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def confirm_payment(payment_intent_id: str, booking_id: int, db: Session) -> Dict[str, Any]:
        """Confirm a payment and update booking status"""
        try:
            # Retrieve payment intent
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if intent.status == "succeeded":
                # Get booking details
                booking = db.query(Booking).filter(Booking.id == booking_id).first()
                if not booking:
                    return {"success": False, "error": "Booking not found"}
                
                # Get property and resident info
                property = booking.property
                resident = db.query(User).filter(User.id == booking.resident_id).first()
                
                # Create payment transaction
                transaction = PaymentTransaction(
                    booking_id=booking_id,
                    stripe_payment_id=payment_intent_id,
                    amount=intent.amount / 100,  # Convert from cents
                    currency=intent.currency,
                    status="completed"
                )
                db.add(transaction)
                
                # Update booking status
                booking.payment_status = "completed"
                booking.status = "confirmed"
                db.commit()
                
                # Send payment confirmation email
                if resident:
                    email_service.send_payment_confirmation(
                        email=resident.email,
                        user_name=resident.full_name or resident.username,
                        transaction_id=payment_intent_id,
                        amount=intent.amount / 100,
                        payment_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    )
                
                return {
                    "success": True,
                    "message": "Payment confirmed and booking updated",
                    "booking_id": booking_id,
                    "transaction_id": payment_intent_id,
                }
            else:
                return {
                    "success": False,
                    "error": f"Payment intent status: {intent.status}"
                }
        except Exception as e:
            logger.error(f"Error confirming payment: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def refund_payment(transaction_id: str, reason: Optional[str] = None, db: Session = None) -> Dict[str, Any]:
        """Refund a payment"""
        try:
            # Retrieve the payment intent
            intent = stripe.PaymentIntent.retrieve(transaction_id)
            
            # Create refund
            refund = stripe.Refund.create(
                payment_intent=transaction_id,
                reason=reason or "requested_by_customer"
            )
            
            if refund.status == "succeeded":
                # Update payment transaction in DB
                if db:
                    transaction = db.query(PaymentTransaction).filter(
                        PaymentTransaction.stripe_payment_id == transaction_id
                    ).first()
                    if transaction:
                        transaction.status = "refunded"
                        # Get associated booking and update
                        booking = db.query(Booking).filter(Booking.id == transaction.booking_id).first()
                        if booking:
                            booking.payment_status = "refunded"
                        db.commit()
                
                return {
                    "success": True,
                    "refund_id": refund.id,
                    "amount": refund.amount / 100,
                    "status": "completed",
                }
            else:
                return {
                    "success": False,
                    "error": f"Refund status: {refund.status}"
                }
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error creating refund: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def handle_webhook_event(event: Dict[str, Any], db: Session) -> bool:
        """Handle Stripe webhook events"""
        try:
            event_type = event.get("type")
            event_data = event.get("data", {}).get("object", {})
            
            if event_type == "payment_intent.succeeded":
                payment_intent_id = event_data.get("id")
                metadata = event_data.get("metadata", {})
                booking_id = metadata.get("booking_id")
                
                if booking_id:
                    PaymentService.confirm_payment(payment_intent_id, int(booking_id), db)
            
            elif event_type == "payment_intent.payment_failed":
                payment_intent_id = event_data.get("id")
                metadata = event_data.get("metadata", {})
                booking_id = metadata.get("booking_id")
                
                if booking_id:
                    booking = db.query(Booking).filter(Booking.id == int(booking_id)).first()
                    if booking:
                        booking.payment_status = "failed"
                        db.commit()
            
            elif event_type == "charge.refunded":
                payment_intent_id = event_data.get("payment_intent")
                if payment_intent_id:
                    transaction = db.query(PaymentTransaction).filter(
                        PaymentTransaction.stripe_payment_id == payment_intent_id
                    ).first()
                    if transaction:
                        transaction.status = "refunded"
                        db.commit()
            
            return True
        except Exception as e:
            logger.error(f"Error handling webhook event: {str(e)}")
            return False

# Create payment service instance
payment_service = PaymentService()
