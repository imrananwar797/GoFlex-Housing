"""SQLAlchemy database models"""
from datetime import datetime
from enum import Enum as PyEnum

from app.core.database import Base
from sqlalchemy import (JSON, Boolean, Column, Date, DateTime, Enum, Float,
                        ForeignKey, Integer, LargeBinary, String, Text)
from sqlalchemy.orm import relationship, synonym
from sqlalchemy.sql import func


class UserRole(str, PyEnum):
    """User role enumeration"""
    ADMIN = "admin"
    RESIDENT = "resident"
    OWNER = "owner"
    STAFF = "staff"


class User(Base):
    """User model for authentication and basic info"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    password_hash = Column("hashed_password", String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.RESIDENT, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    resident_profile = relationship("Resident", back_populates="user", uselist=False)
    owner_profile = relationship("Owner", back_populates="user", uselist=False)
    face_encodings = relationship("FaceEncodingData", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")


class Resident(Base):
    """Resident model for resident-specific information"""
    __tablename__ = "residents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    check_in_date = Column(DateTime, nullable=True)
    check_out_date = Column(DateTime, nullable=True)
    emergency_contact = Column(String(255), nullable=True)
    kyc_status = Column(String(50), default="pending")
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resident_profile")
    property = relationship("Property", back_populates="residents")


class Owner(Base):
    """Owner model for property owner information"""
    __tablename__ = "owners"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String(255), nullable=True)
    tax_id = Column(String(50), nullable=True)
    bank_account = Column(String(255), nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="owner_profile")
    properties = relationship("Property", back_populates="owner")


class Property(Base):
    """Property model for co-living spaces"""
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("owners.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    state_iso = Column(String(2), nullable=True)
    address = Column(String(500), nullable=True)
    beds = Column(Integer, default=1)
    baths = Column(Integer, default=1)
    monthly_price = Column(Float, nullable=False)
    occupancy = Column(Float, default=0)
    amenities = Column(JSON, nullable=True)
    featured_image = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    rent = synonym("monthly_price")
    verified = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("Owner", back_populates="properties")
    residents = relationship("Resident", back_populates="property")
    bookings = relationship("Booking", back_populates="property")
    rooms = relationship("Room", back_populates="property")


class Booking(Base):
    """Booking model for property reservations"""
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=True)
    check_in_date = Column(DateTime, nullable=False)
    check_out_date = Column(DateTime, nullable=False)
    total_guests = Column(Integer, default=1)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    payment_status = Column(String(50), default="pending")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    property = relationship("Property", back_populates="bookings")
    room = relationship("Room")
    resident = relationship("Resident")


class FaceEncodingData(Base):
    """Face encoding data for face recognition"""
    __tablename__ = "face_encodings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    encoding_data = Column(LargeBinary, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="face_encodings")


class FaceVerificationLog(Base):
    """Log for face recognition portal entry verification"""
    __tablename__ = "face_verification_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    verification_status = Column(String(50), default="pending")  # success, failed, pending
    confidence_score = Column(Float, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id])


class PaymentTransaction(Base):
    """Payment transaction model for Stripe payments"""
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    stripe_payment_id = Column(String(255), unique=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="usd")
    status = Column(String(50), default="pending")  # pending, processing, completed, failed, refunded
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    booking = relationship("Booking", foreign_keys=[booking_id])


class Room(Base):
    """Room model for individual rooms within properties"""
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), index=True)
    room_number = Column(String(50), nullable=False)
    room_type = Column(String(50), nullable=False)  # private, shared, etc.
    capacity = Column(Integer, default=1)
    monthly_price = Column(Float, nullable=False)
    amenities = Column(JSON, nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    property = relationship("Property", back_populates="rooms")
    inventory = relationship("RoomInventory", back_populates="room", uselist=False)


class RoomInventory(Base):
    """Inventory tracking for room availability"""
    __tablename__ = "room_inventory"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), unique=True, index=True)
    total_capacity = Column(Integer, nullable=False)
    available_slots = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    room = relationship("Room", back_populates="inventory")
    availabilities = relationship("RoomAvailability", back_populates="inventory")


class RoomAvailability(Base):
    """Specific date availability for rooms"""
    __tablename__ = "room_availability"

    id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("room_inventory.id"), index=True)
    date = Column(Date, nullable=False, index=True)
    available_slots = Column(Integer, nullable=False)
    booked_slots = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    inventory = relationship("RoomInventory", back_populates="availabilities")


class KycDocument(Base):
    """KYC document uploads for verification"""
    __tablename__ = "kyc_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    document_type = Column(String(50), nullable=False)  # passport, id_card, etc.
    file_path = Column(String(500), nullable=False)
    status = Column(String(50), default="pending")  # pending, approved, rejected
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])


class SubscriptionPlan(Base):
    """Subscription plans for different service tiers"""
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    interval = Column(String(20), default="month")  # month, year
    features = Column(JSON, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    """User subscriptions"""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), index=True)
    stripe_subscription_id = Column(String(255), unique=True, index=True)
    status = Column(String(50), default="active")  # active, canceled, past_due
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")


class Review(Base):
    """Property reviews by residents"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    is_featured = Column(Boolean, default=False)
    status = Column(String(50), default="published")  # published, pending, rejected
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    property = relationship("Property")
    user = relationship("User")
    media = relationship("ReviewMedia", back_populates="review")
    responses = relationship("ReviewResponse", back_populates="review")


class ReviewMedia(Base):
    """Media (photos/videos) attached to reviews"""
    __tablename__ = "review_media"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), index=True)
    media_type = Column(String(50), nullable=False)  # image, video
    media_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    review = relationship("Review", back_populates="media")


class ReviewResponse(Base):
    """Owner responses to reviews"""
    __tablename__ = "review_responses"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), unique=True, index=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), index=True)
    response_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    review = relationship("Review", back_populates="responses")
    owner = relationship("Owner")


class CalendarSync(Base):
    """Calendar provider connections (Google, Outlook)"""
    __tablename__ = "calendar_syncs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    provider = Column(String(50), nullable=False)  # google, outlook
    access_token = Column(String(1000), nullable=False)
    refresh_token = Column(String(1000), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    sync_token = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User")
    events = relationship("SyncedEvent", back_populates="sync_connection")


class SyncedEvent(Base):
    """Events synced from external calendars"""
    __tablename__ = "synced_events"

    id = Column(Integer, primary_key=True, index=True)
    sync_id = Column(Integer, ForeignKey("calendar_syncs.id"), index=True)
    external_event_id = Column(String(255), nullable=False, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    title = Column(String(255), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    sync_connection = relationship("CalendarSync", back_populates="events")
    booking = relationship("Booking")


class EscrowAccount(Base):
    """Escrow accounts for holding payments"""
    __tablename__ = "escrow_accounts"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, index=True)
    amount_held = Column(Float, nullable=False)
    status = Column(String(50), default="held")  # held, released, refunded, disputed
    release_date = Column(DateTime, nullable=True)
    dispute_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    booking = relationship("Booking")


class FraudAlert(Base):
    """Fraud detection system alerts"""
    __tablename__ = "fraud_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True, index=True)
    severity = Column(String(50), default="low")  # low, medium, high, critical
    alert_type = Column(String(100), nullable=False)  # velocity, fingerprint, location, payment
    description = Column(Text, nullable=False)
    status = Column(String(50), default="open")  # open, investigating, resolved, false_positive
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User")
    booking = relationship("Booking")
