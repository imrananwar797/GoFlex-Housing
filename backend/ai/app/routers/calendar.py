from datetime import datetime
from typing import List

from app.core.database import get_db
from app.models.database_models import CalendarSync, SyncedEvent
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()


class SyncCreate(BaseModel):
    provider: str
    access_token: str
    refresh_token: str | None = None
    expires_at: datetime | None = None


class EventSync(BaseModel):
    external_event_id: str
    title: str
    start_time: datetime
    end_time: datetime


@router.post("/connect")
async def connect_calendar(
    sync_data: SyncCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Connect a calendar provider (Google/Outlook)"""
    # Check if already connected
    existing_sync = db.query(CalendarSync).filter(
        CalendarSync.user_id == current_user.id,
        CalendarSync.provider == sync_data.provider
    ).first()
    
    if existing_sync:
        existing_sync.access_token = sync_data.access_token
        existing_sync.refresh_token = sync_data.refresh_token
        existing_sync.expires_at = sync_data.expires_at
        existing_sync.is_active = True
        sync = existing_sync
    else:
        sync = CalendarSync(
            user_id=current_user.id,
            provider=sync_data.provider,
            access_token=sync_data.access_token,
            refresh_token=sync_data.refresh_token,
            expires_at=sync_data.expires_at
        )
        db.add(sync)
        
    db.commit()
    db.refresh(sync)
    return {"status": "success", "sync_id": sync.id, "provider": sync.provider}


@router.get("/status")
async def get_calendar_status(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get status of connected calendars"""
    syncs = db.query(CalendarSync).filter(
        CalendarSync.user_id == current_user.id,
        CalendarSync.is_active == True
    ).all()
    
    return [
        {
            "id": s.id,
            "provider": s.provider,
            "connected_at": s.created_at
        } for s in syncs
    ]


@router.post("/{sync_id}/sync-events")
async def sync_events(
    sync_id: int,
    events: List[EventSync],
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Sync events from external calendar"""
    sync = db.query(CalendarSync).filter(
        CalendarSync.id == sync_id,
        CalendarSync.user_id == current_user.id
    ).first()
    
    if not sync:
        raise HTTPException(status_code=404, detail="Calendar connection not found")
        
    synced_events = []
    for event in events:
        new_event = SyncedEvent(
            sync_id=sync.id,
            external_event_id=event.external_event_id,
            title=event.title,
            start_time=event.start_time,
            end_time=event.end_time
        )
        db.add(new_event)
        synced_events.append(new_event)
        
    db.commit()
    return {"status": "success", "synced_count": len(synced_events)}
