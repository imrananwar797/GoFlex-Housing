"""GoFlex Housing Backend - FastAPI Application"""
import logging

from app.core.config import settings
from app.core.database import engine
# Import new models here so Alembic/SQLAlchemy detects them for table creation
from app.models import messaging_models
from app.models.database_models import Base
import sentry_sdk
from app.routers import (
    recommendations, fraud, video, storage, pricing, subscriptions,
    owner, analytics, payments, admin, inventory, messages, reviews, search, kyc
)
from app.services.socket_manager import socket_app
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from app.middleware.internal_auth import InternalAuthMiddleware

# Initialize Sentry
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="GoFlex Housing Backend API",
    debug=settings.DEBUG
)


@app.on_event("startup")
async def startup_event():
    # Create database tables
    Base.metadata.create_all(bind=engine)


# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZIP compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add Internal Service-to-Service Auth
app.add_middleware(InternalAuthMiddleware)

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "service": "GoFlex AI Service",
        "version": settings.APP_VERSION
    }


# Include routers
app.include_router(fraud.router, prefix="/api/fraud-alerts", tags=["fraud"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(video.router, prefix="/api/video", tags=["video"])
app.include_router(storage.router, prefix="/api/storage", tags=["storage"])
app.include_router(pricing.router, tags=["pricing"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])
app.include_router(owner.router, prefix="/api/owner", tags=["owner"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(kyc.router, prefix="/api/kyc", tags=["kyc"])


@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Welcome to GoFlex Housing Backend API",
        "docs": "/docs",
        "version": settings.APP_VERSION
    }


# Error handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.DEBUG,
        log_level="info"
    )
