"""
Ordain.Church - Spiritual Platform API
Complete ordination and marriage ceremony platform
"""
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from server.database import init_db
from server.routes import auth, billing, ceremony_builder, certificates, marriage_laws


def _cors_origins() -> list[str]:
    """Build an explicit CORS allow-list from env (never '*' with credentials)."""
    raw = os.getenv("CORS_ORIGINS", "").strip()
    origins: list[str] = []
    if raw:
        origins.extend(o.strip() for o in raw.split(",") if o.strip())
    app_url = os.getenv("APP_URL", "http://localhost:8001").strip()
    if app_url and app_url not in origins:
        origins.append(app_url)
    # Local Vite + production defaults
    for default in (
        "http://localhost:8001",
        "http://localhost:8080",
        "http://127.0.0.1:8001",
        "http://127.0.0.1:8080",
    ):
        if default not in origins:
            origins.append(default)
    return origins


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Initialize database tables on startup."""
    print("Initializing database...")
    init_db()
    print("Database initialized successfully")
    yield


app = FastAPI(title="Ordain.Church API", version="1.0.1", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin"],
)

app.include_router(auth.router)
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(marriage_laws.router)
app.include_router(ceremony_builder.router)
app.include_router(certificates.router)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ordain.church"}


# Serve built frontend from either Docker (`static/`) or local Vite (`dist/`)
_repo_root = os.path.dirname(os.path.dirname(__file__))
for _candidate in ("static", "dist"):
    _static_dir = os.path.join(_repo_root, _candidate)
    if os.path.isdir(_static_dir):
        app.mount("/", StaticFiles(directory=_static_dir, html=True), name="static")
        break


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8001")))
