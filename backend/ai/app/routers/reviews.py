from typing import List

from app.core.database import get_db
from app.models.database_models import Review, ReviewMedia, ReviewResponse, UserRole
from app.routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()


class ReviewCreate(BaseModel):
    property_id: int
    rating: float
    comment: str | None = None


class MediaCreate(BaseModel):
    media_type: str
    media_url: str


class ResponseCreate(BaseModel):
    response_text: str


@router.post("/")
async def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Create a new property review"""
    new_review = Review(
        property_id=review.property_id,
        user_id=current_user.id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


@router.get("/property/{property_id}")
async def get_property_reviews(property_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a property"""
    reviews = db.query(Review).filter(Review.property_id == property_id, Review.status == "published").all()
    return reviews


@router.post("/{review_id}/media")
async def upload_review_media(
    review_id: int,
    media: MediaCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Upload media for a review"""
    review = db.query(Review).filter(Review.id == review_id, Review.user_id == current_user.id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found or not owned by user")
    
    new_media = ReviewMedia(
        review_id=review_id,
        media_type=media.media_type,
        media_url=media.media_url
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return new_media


@router.post("/{review_id}/respond")
async def respond_to_review(
    review_id: int,
    response: ResponseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Owner responds to a review"""
    if current_user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Only owners can respond to reviews")
        
    # Check if owner actually owns the property associated with the review
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    owner = current_user.owner_profile
    if not owner:
        raise HTTPException(status_code=400, detail="Owner profile not found")

    new_response = ReviewResponse(
        review_id=review_id,
        owner_id=owner.id,
        response_text=response.response_text
    )
    db.add(new_response)
    db.commit()
    db.refresh(new_response)
    return new_response
