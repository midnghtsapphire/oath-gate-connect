"""Smoke tests for the Ordain.Church API health surface."""
import os

# Ensure test-safe defaults before app import
os.environ.setdefault("DATABASE_URL", "sqlite:///./test-ordainchurch.db")
os.environ.setdefault("JWT_SECRET", "ci-test-secret-not-for-production")
os.environ.setdefault("APP_URL", "http://localhost:8001")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:8001")

from fastapi.testclient import TestClient

from server.main import app, _cors_origins


client = TestClient(app)


def test_health_endpoint_ok():
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"
    assert body["service"] == "ordain.church"


def test_openapi_available():
    response = client.get("/openapi.json")
    assert response.status_code == 200
    body = response.json()
    assert body["info"]["title"] == "Ordain.Church API"


def test_cors_origins_never_wildcard():
    origins = _cors_origins()
    assert origins, "expected at least one CORS origin"
    assert "*" not in origins
    assert "http://localhost:8001" in origins
