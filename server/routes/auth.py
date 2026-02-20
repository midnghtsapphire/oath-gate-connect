"""Authentication routes - JWT + Google OAuth + Apple Sign-In."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import httpx
import secrets
from server.database import get_db
from server.models import User
from server.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth state storage (in production, use Redis)
oauth_states = {}

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register with email and password"""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role="user",
        ordination_date=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token({"sub": new_user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
            "ordination_date": new_user.ordination_date.isoformat() if new_user.ordination_date else None
        }
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not user.hashed_password or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    
    access_token = create_access_token({"sub": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "ordination_date": user.ordination_date.isoformat() if user.ordination_date else None
        }
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "profile_image": current_user.profile_image,
        "is_verified": current_user.is_verified,
        "ordination_date": current_user.ordination_date.isoformat() if current_user.ordination_date else None,
        "ordination_tier": current_user.ordination_tier
    }

# ============================================================================
# GOOGLE OAUTH
# ============================================================================

@router.get("/google")
async def google_login(request: Request):
    """Initiate Google OAuth flow"""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    state = secrets.token_urlsafe(32)
    oauth_states[state] = {"provider": "google", "created_at": datetime.utcnow()}
    
    redirect_uri = f"{settings.APP_URL}/api/auth/google/callback"
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=openid email profile&"
        f"state={state}"
    )
    
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str, state: str, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state")
    
    del oauth_states[state]
    
    # Exchange code for token
    redirect_uri = f"{settings.APP_URL}/api/auth/google/callback"
    token_url = "https://oauth2.googleapis.com/token"
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        })
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        # Get user info
        userinfo_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if userinfo_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        user_info = userinfo_response.json()
    
    # Find or create user
    google_id = user_info.get("id")
    email = user_info.get("email")
    name = user_info.get("name", email)
    picture = user_info.get("picture")
    
    user = db.query(User).filter(User.google_id == google_id).first()
    
    if not user:
        # Check if email exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Link Google account to existing user
            user.google_id = google_id
            user.profile_image = picture
        else:
            # Create new user
            user = User(
                email=email,
                full_name=name,
                google_id=google_id,
                profile_image=picture,
                role="user",
                is_verified=True,
                ordination_date=datetime.utcnow()
            )
            db.add(user)
        
        db.commit()
        db.refresh(user)
    
    # Create JWT token
    jwt_token = create_access_token({"sub": user.id})
    
    # Redirect to frontend with token
    frontend_url = f"{settings.APP_URL}/?token={jwt_token}"
    return RedirectResponse(url=frontend_url)

# ============================================================================
# APPLE SIGN-IN
# ============================================================================

@router.get("/apple")
async def apple_login(request: Request):
    """Initiate Apple Sign-In flow"""
    if not settings.APPLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Apple Sign-In not configured")
    
    state = secrets.token_urlsafe(32)
    oauth_states[state] = {"provider": "apple", "created_at": datetime.utcnow()}
    
    redirect_uri = f"{settings.APP_URL}/api/auth/apple/callback"
    apple_auth_url = (
        f"https://appleid.apple.com/auth/authorize?"
        f"client_id={settings.APPLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"response_mode=form_post&"
        f"scope=name email&"
        f"state={state}"
    )
    
    return RedirectResponse(url=apple_auth_url)

@router.post("/apple/callback")
async def apple_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Apple Sign-In callback"""
    form_data = await request.form()
    code = form_data.get("code")
    state = form_data.get("state")
    user_data = form_data.get("user")  # Apple sends user data on first sign-in
    
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state")
    
    del oauth_states[state]
    
    # Exchange code for token
    redirect_uri = f"{settings.APP_URL}/api/auth/apple/callback"
    token_url = "https://appleid.apple.com/auth/token"
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data={
            "code": code,
            "client_id": settings.APPLE_CLIENT_ID,
            "client_secret": settings.APPLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        })
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        token_data = token_response.json()
        id_token = token_data.get("id_token")
        
        # Decode ID token (Apple uses JWT)
        decoded = jwt.decode(id_token, options={"verify_signature": False})
        apple_id = decoded.get("sub")
        email = decoded.get("email")
    
    # Parse user data if provided (first sign-in only)
    import json
    full_name = email
    if user_data:
        try:
            user_json = json.loads(user_data)
            name_obj = user_json.get("name", {})
            first = name_obj.get("firstName", "")
            last = name_obj.get("lastName", "")
            if first or last:
                full_name = f"{first} {last}".strip()
        except:
            pass
    
    # Find or create user
    user = db.query(User).filter(User.apple_id == apple_id).first()
    
    if not user:
        # Check if email exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Link Apple account to existing user
            user.apple_id = apple_id
        else:
            # Create new user
            user = User(
                email=email,
                full_name=full_name,
                apple_id=apple_id,
                role="user",
                is_verified=True,
                ordination_date=datetime.utcnow()
            )
            db.add(user)
        
        db.commit()
        db.refresh(user)
    
    # Create JWT token
    jwt_token = create_access_token({"sub": user.id})
    
    # Redirect to frontend with token
    frontend_url = f"{settings.APP_URL}/?token={jwt_token}"
    return RedirectResponse(url=frontend_url)
