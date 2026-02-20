"""Configuration for Ordain.church."""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Ordain.church"
    APP_URL: str = os.getenv("APP_URL", "http://localhost:8001")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ordainchurch.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "ordainchurch-jwt-secret-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # Apple Sign-In
    APPLE_CLIENT_ID: str = os.getenv("APPLE_CLIENT_ID", "")
    APPLE_CLIENT_SECRET: str = os.getenv("APPLE_CLIENT_SECRET", "")
    APPLE_TEAM_ID: str = os.getenv("APPLE_TEAM_ID", "")
    APPLE_KEY_ID: str = os.getenv("APPLE_KEY_ID", "")
    
    # OpenRouter (for AI ceremony generation)
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "")

    # Dual-mode Stripe
    STRIPE_MODE: str = os.getenv("STRIPE_MODE", "test")
    STRIPE_TEST_SECRET_KEY: str = os.getenv("STRIPE_TEST_SECRET_KEY", "")
    STRIPE_LIVE_SECRET_KEY: str = os.getenv("STRIPE_LIVE_SECRET_KEY", "")
    STRIPE_TEST_PUBLISHABLE_KEY: str = os.getenv("STRIPE_TEST_PUBLISHABLE_KEY", "")
    STRIPE_LIVE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_LIVE_PUBLISHABLE_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    @property
    def STRIPE_SECRET_KEY(self) -> str:
        return self.STRIPE_LIVE_SECRET_KEY if self.STRIPE_MODE == "live" else self.STRIPE_TEST_SECRET_KEY

    @property
    def STRIPE_PUBLISHABLE_KEY(self) -> str:
        return self.STRIPE_LIVE_PUBLISHABLE_KEY if self.STRIPE_MODE == "live" else self.STRIPE_TEST_PUBLISHABLE_KEY

    class Config:
        env_file = ".env"
        extra = "allow"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
