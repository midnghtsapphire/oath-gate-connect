"""Database models for Ordain.church."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    
    # OAuth fields
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    apple_id = Column(String(255), unique=True, nullable=True, index=True)
    profile_image = Column(String(500), nullable=True)
    
    phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Ordination fields
    ordination_date = Column(DateTime(timezone=True), nullable=True)
    ordination_tier = Column(String(50), default="basic")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    tier = Column(String(50), default="free")
    
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    stripe_payment_intent_id = Column(String(255), nullable=True)
    
    status = Column(String(50), default="active")
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CeremonyScript(Base):
    __tablename__ = "ceremony_scripts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    ceremony_type = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    
    # Ceremony details
    partner1_name = Column(String(255), nullable=True)
    partner2_name = Column(String(255), nullable=True)
    traditions = Column(JSON, nullable=True)
    tone = Column(String(50), nullable=True)
    
    is_premium = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    certificate_type = Column(String(50), nullable=False)  # ordination, marriage
    
    # Ordination certificate fields
    minister_name = Column(String(255), nullable=True)
    ordination_date = Column(DateTime(timezone=True), nullable=True)
    denomination = Column(String(100), nullable=True)
    specializations = Column(JSON, nullable=True)
    
    # Marriage certificate fields
    partner1_name = Column(String(255), nullable=True)
    partner2_name = Column(String(255), nullable=True)
    officiant_name = Column(String(255), nullable=True)
    ceremony_date = Column(String(100), nullable=True)
    ceremony_location = Column(String(500), nullable=True)
    
    # Certificate data
    verification_url = Column(String(500), nullable=False)
    qr_code_path = Column(String(500), nullable=True)
    pdf_path = Column(String(500), nullable=True)
    
    is_verified = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
