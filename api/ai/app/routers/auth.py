"""Authentication API routes"""
import base64
import io
from datetime import timedelta

import pyotp
import qrcode
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (create_access_token, decode_token,
                               get_password_hash, verify_password)
from app.models.database_models import User, UserRole
from app.schemas.auth_schemas import (LoginRequest, PasswordChange, Token,
                                      TokenData, UserCreate, UserResponse)
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def get_user_by_username(db: Session, username: str):
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, username: str, password: str) -> User:
    """Authenticate user credentials"""
    user = get_user_by_username(db, username)
    if not user:
        user = get_user_by_email(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(token: str=Depends(oauth2_scheme), db: Session=Depends(get_db)) -> User:
    """Get current authenticated user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if not payload:
        raise credentials_exception
    
    username = payload.get("sub")
    if not username:
        raise credentials_exception
    
    user = get_user_by_username(db, username)
    if not user:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    
    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session=Depends(get_db)):
    """Register a new user"""
    
    # Check if user already exists
    if get_user_by_username(db, user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    if get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=user_data.role,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session=Depends(get_db)):
    """Login and get access token or 2FA requirement"""
    user = authenticate_user(db, credentials.username, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.two_factor_enabled:
        # Generate a temporary token for 2FA validation
        temp_token = create_access_token(
            data={"sub": user.username, "user_id": user.id, "role": user.role, "scope": "2fa_pending"},
            expires_delta=timedelta(minutes=5)
        )
        return {
            "requires_2fa": True,
            "temp_token": temp_token
        }

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user,
        "requires_2fa": False
    }


@router.post("/2fa/validate-login", response_model=Token)
def validate_2fa_login(data: TwoFactorValidate, db: Session=Depends(get_db)):
    """Validate 2FA code and get final access token"""
    payload = decode_token(data.temp_token)
    if not payload or payload.get("scope") != "2fa_pending":
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    totp = pyotp.TOTP(user.two_factor_secret)
    if not totp.verify(data.code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_info(token: str=None, db: Session=Depends(get_db)):
    """Get current user information"""
    user = get_current_user(token, db)
    return user


@router.post("/change-password")
def change_password(password_data: PasswordChange, token: str=None, db: Session=Depends(get_db)):
    """Change user password"""
    user = get_current_user(token, db)
    
    # Verify current password
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}


@router.post("/logout")
def logout(token: str=None, db: Session=Depends(get_db)):
    """Logout user (client should remove token)"""
    user = get_current_user(token, db)
    return {"message": "Successfully logged out"}


@router.post("/refresh-token", response_model=Token)
def refresh_token(token: str=None, db: Session=Depends(get_db)):
    """Refresh access token"""
    user = get_current_user(token, db)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

# --- Two-Factor Authentication Endpoints ---


@router.post("/2fa/setup")
def setup_2fa(
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Generate 2FA secret and QR code"""
    if current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="2FA already enabled")

    # Generate secret
    secret = pyotp.random_base32()
    current_user.two_factor_secret = secret
    db.commit()

    # Generate QR code
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(name=current_user.email, issuer_name="GoFlex Housing")

    # Create QR code image
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')

    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        "secret": secret,
        "qr_code": f"data:image/png;base64,{qr_code_base64}",
        "message": "Scan QR code with authenticator app, then verify with /2fa/verify"
    }


@router.post("/2fa/verify")
def verify_2fa(
    code: str,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Verify 2FA code and enable 2FA"""
    if not current_user.two_factor_secret:
        raise HTTPException(status_code=400, detail="2FA not set up")

    totp = pyotp.TOTP(current_user.two_factor_secret)
    if not totp.verify(code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")

    current_user.two_factor_enabled = True
    db.commit()

    return {"message": "2FA enabled successfully"}


@router.post("/2fa/validate")
def validate_2fa(
    code: str,
    db: Session=Depends(get_db),
    current_user: User=Depends(get_current_user)
):
    """Validate 2FA code for login"""
    if not current_user.two_factor_enabled or not current_user.two_factor_secret:
        raise HTTPException(status_code=400, detail="2FA not enabled")

    totp = pyotp.TOTP(current_user.two_factor_secret)
    if not totp.verify(code):
        raise HTTPException(status_code=400, detail="Invalid 2FA code")

    return {"message": "2FA code valid"}
