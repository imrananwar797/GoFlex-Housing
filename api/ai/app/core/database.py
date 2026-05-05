"""Database configuration and session management"""
from typing import Generator

from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Get database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Drop all database tables (for testing)"""
    Base.metadata.drop_all(bind=engine)
