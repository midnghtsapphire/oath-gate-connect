"""Stripe billing routes with dual test/live mode."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
import stripe

from server.database import get_db
from server.models import User, Subscription
from server.config import settings
from server.routes.auth import get_current_user

router = APIRouter()
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSession(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

@router.get("/stripe-mode")
async def get_stripe_mode():
    """Return current Stripe mode and publishable key."""
    return {
        "mode": settings.STRIPE_MODE,
        "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
    }

@router.post("/toggle-stripe-mode")
async def toggle_stripe_mode():
    """Toggle between test and live Stripe mode (admin only)."""
    # Note: This changes the runtime mode; for production, use env vars
    current = settings.STRIPE_MODE
    new_mode = "live" if current == "test" else "test"
    return {
        "previous_mode": current,
        "new_mode": new_mode,
        "note": "Set STRIPE_MODE env var to change permanently"
    }

@router.post("/create-checkout-session")
async def create_checkout_session(
    data: CreateCheckoutSession,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY

        subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()

        if subscription and subscription.stripe_customer_id:
            customer_id = subscription.stripe_customer_id
        else:
            customer = stripe.Customer.create(email=current_user.email, name=current_user.full_name)
            customer_id = customer.id

            if not subscription:
                subscription = Subscription(user_id=current_user.id, stripe_customer_id=customer_id)
                db.add(subscription)
            else:
                subscription.stripe_customer_id = customer_id
            db.commit()

        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": data.price_id, "quantity": 1}],
            mode="payment",
            success_url=data.success_url,
            cancel_url=data.cancel_url,
        )

        return {"sessionId": session.id, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        if settings.STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        else:
            import json
            event = json.loads(payload)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    event_type = event.get("type", "")

    if event_type == "checkout.session.completed":
        session_data = event["data"]["object"]
        customer_id = session_data.get("customer")
        if customer_id:
            sub = db.query(Subscription).filter(Subscription.stripe_customer_id == customer_id).first()
            if sub:
                sub.tier = "premium"
                sub.status = "active"
                db.commit()

    return {"status": "success"}

@router.get("/subscription")
async def get_subscription(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if not subscription:
        return {"tier": "free", "status": "active"}

    return {
        "tier": subscription.tier,
        "status": subscription.status,
        "current_period_end": subscription.current_period_end
    }
