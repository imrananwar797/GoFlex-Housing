"""Authentication and user schemas"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.database_models import UserRole

class UserCreate(BaseModel):
    """User creation schema"""
    username: str = Field(..., min_length=3, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole = UserRole.RESIDENT

class UserUpdate(BaseModel):
    """User update schema"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    username: str
    email: str
    full_name: Optional[str]
    phone: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenData(BaseModel):
    """Token data schema"""
    username: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[UserRole] = None

class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str
    expires_in: int
    user: Optional[UserResponse] = None

class LoginResponse(BaseModel):
    """Login response schema with 2FA support"""
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    expires_in: Optional[int] = None
    user: Optional[UserResponse] = None
    requires_2fa: bool = False
    temp_token: Optional[str] = None

class TwoFactorValidate(BaseModel):
    """2FA validation schema"""
    code: str
    temp_token: str

class LoginRequest(BaseModel):
    """Login request schema"""
    username: str
    password: str
    role: Optional[UserRole] = UserRole.RESIDENT

class PasswordChange(BaseModel):
    """Password change schema"""
    current_password: str
    new_password: str = Field(..., min_length=6)
