from typing import List

from app.core.database import get_db
from app.models.database_models import EscrowAccount, UserRole
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()


class Disputerequest(BaseModel):
    reason: str


@router.post("/{booking_id}/hold")
async def hold_funds_in_escrow(
    booking_id: int,
    amount: float,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Hold funds in escrow for a booking"""
    # In a real app, this would be called by the payment webhook
    existing = db.query(EscrowAccount).filter(EscrowAccount.booking_id == booking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Escrow account already exists for this booking")
        
    escrow = EscrowAccount(
        booking_id=booking_id,
        amount_held=amount,
        status="held"
    )
    db.add(escrow)
    db.commit()
    db.refresh(escrow)
    return escrow


@router.post("/{booking_id}/release")
async def release_escrow(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Release funds from escrow to the owner"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can manually release escrow")
        
    escrow = db.query(EscrowAccount).filter(EscrowAccount.booking_id == booking_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow account not found")
        
    if escrow.status != "held":
        raise HTTPException(status_code=400, detail=f"Cannot release from status: {escrow.status}")
        
    escrow.status = "released"
    db.commit()
    db.refresh(escrow)
    return {"status": "success", "message": "Funds released to owner"}


@router.post("/{booking_id}/dispute")
async def dispute_escrow(
    booking_id: int,
    dispute: Disputerequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Open a dispute for funds held in escrow"""
    escrow = db.query(EscrowAccount).filter(EscrowAccount.booking_id == booking_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow account not found")
        
    if escrow.status != "held":
        raise HTTPException(status_code=400, detail="Can only dispute funds currently held")
        
    escrow.status = "disputed"
    escrow.dispute_reason = dispute.reason
    db.commit()
    db.refresh(escrow)
    return {"status": "disputed", "message": "Dispute opened successfully"}


@router.get("/{booking_id}/status")
async def get_escrow_status(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get the current status of an escrow account"""
    escrow = db.query(EscrowAccount).filter(EscrowAccount.booking_id == booking_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow account not found")
        
    return {
        "booking_id": escrow.booking_id,
        "amount_held": escrow.amount_held,
        "status": escrow.status,
        "dispute_reason": escrow.dispute_reason
    }
