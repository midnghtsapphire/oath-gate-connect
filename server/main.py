"""FastAPI application for Ordain.church."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import uvicorn

from server.config import settings
from server.database import init_db
from server.routes import auth, billing

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting {settings.APP_NAME}")
    print(f"Stripe Mode: {settings.STRIPE_MODE}")
    init_db()
    yield
    print(f"Shutting down {settings.APP_NAME}")

app = FastAPI(
    title="Ordain.church API",
    description="Ordain.church backend API — inclusive spiritual platform for ordination, ceremonies, and community",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "stripe_mode": settings.STRIPE_MODE,
        "version": "2.0.0"
    }

@app.get("/api/config")
async def get_public_config():
    """Return public configuration for the frontend."""
    return {
        "stripe_publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        "stripe_mode": settings.STRIPE_MODE,
        "app_name": settings.APP_NAME,
    }

@app.get("/api/marriage-laws")
async def get_marriage_laws():
    """Return state-by-state marriage law data."""
    import json
    data_path = os.path.join(os.path.dirname(__file__), "data", "state_marriage_laws.json")
    if os.path.exists(data_path):
        with open(data_path) as f:
            return json.load(f)
    return {}

@app.get("/api/marriage-laws/{state_code}")
async def get_state_marriage_law(state_code: str):
    """Return marriage law data for a specific state."""
    import json
    data_path = os.path.join(os.path.dirname(__file__), "data", "state_marriage_laws.json")
    if os.path.exists(data_path):
        with open(data_path) as f:
            data = json.load(f)
            state = data.get(state_code.upper())
            if state:
                return state
    return {"error": "State not found"}

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])

# Serve static frontend files
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the SPA for all non-API routes."""
        file_path = os.path.join(static_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))

if __name__ == "__main__":
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
