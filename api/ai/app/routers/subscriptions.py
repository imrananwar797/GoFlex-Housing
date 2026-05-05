from typing import List

import stripe
from app.core.config import settings
from app.core.database import get_db
from app.models.database_models import Subscription, SubscriptionPlan, User
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


@router.get("/plans")
def get_subscription_plans(
    db: Session=Depends(get_db)
):
    """Get all active subscription plans"""
    plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.active == True).all()
    return {"plans": plans}


@router.post("/create-checkout-session")
def create_checkout_session(
    plan_id: int,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Create Stripe checkout session for subscription"""
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': plan.name,
                        'description': plan.description,
                    },
                    'unit_amount': int(plan.price * 100),  # Convert to cents
                    'recurring': {
                        'interval': plan.interval,
                    },
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{settings.FRONTEND_URL}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
            client_reference_id=str(current_user.id),
            metadata={
                'plan_id': str(plan_id)
            }
        )

        return {"checkout_url": checkout_session.url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: dict,
    db: Session=Depends(get_db)
):
    """Handle Stripe webhooks"""
    # Verify webhook signature (implement in production)
    event = request

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = int(session['client_reference_id'])
        plan_id = int(session['metadata']['plan_id'])

        # Create subscription record
        subscription = Subscription(
            user_id=user_id,
            plan_id=plan_id,
            stripe_subscription_id=session['subscription'],
            status='active'
        )

        db.add(subscription)
        db.commit()

    elif event['type'] == 'invoice.payment_succeeded':
        # Handle successful payment
        pass

    return {"status": "ok"}


@router.get("/my-subscription")
def get_my_subscription(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Get current user's subscription"""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == 'active'
    ).first()

    if subscription:
        return {"subscription": subscription}
    else:
        return {"subscription": None}
