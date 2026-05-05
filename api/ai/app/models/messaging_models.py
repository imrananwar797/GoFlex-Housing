from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    participants = relationship("ConversationParticipant", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation")

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, server_default=func.now())

    conversation = relationship("Conversation", back_populates="participants")
    user = relationship("User")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    attachments = Column(JSON, nullable=True) # Storing array of URLs as JSON
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False) # 'booking', 'payment', 'system'
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=True)
    data = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())