"""Application configuration settings"""
import os
from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "GoFlex Housing Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Server Settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Database Settings
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", 5432))
    DB_USER: str = os.getenv("DB_USER", "goflex_user")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "goflex_secure_password_123")
    DB_NAME: str = os.getenv("DB_NAME", "goflex_db")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://0.0.0.0:3000",
        "http://0.0.0.0:8000",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Frontend URL
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Face Recognition Settings
    FACE_RECOGNITION_TOLERANCE: float = 0.6
    FACE_RECOGNITION_MODEL: str = "hog"  # or "cnn" for better accuracy
    
    # Stripe Settings
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_placeholder")
    STRIPE_WEBHOOK_SECRET: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET", None)
    
    # Sentry Settings
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN", None)
    
    # Email Settings
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    # AWS Settings (Optional)
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID", None)
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY", None)
    AWS_S3_BUCKET: Optional[str] = os.getenv("AWS_S3_BUCKET", None)
    
    # Redis Settings (Optional)
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
