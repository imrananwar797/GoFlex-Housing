from typing import List

from app.core.database import get_db
from app.models.database_models import FraudAlert, UserRole
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()


class FraudAlertUpdate(BaseModel):
    status: str


@router.get("/")
async def list_fraud_alerts(
    severity: str | None = None,
    status: str = "open",
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """List fraud alerts (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can view fraud alerts")
        
    query = db.query(FraudAlert).filter(FraudAlert.status == status)
    if severity:
        query = query.filter(FraudAlert.severity == severity)
        
    return query.all()


@router.post("/{alert_id}/investigate")
async def investigate_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Mark an alert as being investigated"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can investigate alerts")
        
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = "investigating"
    db.commit()
    db.refresh(alert)
    return alert


@router.post("/{alert_id}/resolve")
async def resolve_alert(
    alert_id: int,
    update: FraudAlertUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Resolve a fraud alert"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can resolve alerts")
        
    if update.status not in ["resolved", "false_positive"]:
        raise HTTPException(status_code=400, detail="Invalid resolution status")
        
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = update.status
    db.commit()
    db.refresh(alert)
    return alert
