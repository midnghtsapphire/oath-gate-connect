"""Unit tests for CORS allow-list helper."""
import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test-ordainchurch.db")
os.environ.setdefault("JWT_SECRET", "ci-test-secret-not-for-production")

from server.main import _cors_origins


def test_cors_includes_app_url(monkeypatch):
    monkeypatch.setenv("APP_URL", "https://ordain.example")
    monkeypatch.setenv("CORS_ORIGINS", "https://app.example")
    origins = _cors_origins()
    assert "https://ordain.example" in origins
    assert "https://app.example" in origins
    assert "*" not in origins
