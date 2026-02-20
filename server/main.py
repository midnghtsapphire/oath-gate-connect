"""
Ordain.Church - Spiritual Platform API
Complete ordination and marriage ceremony platform
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

# Import routes with correct module paths
from server.routes import auth, billing, marriage_laws, ceremony_builder, certificates
from server.database import init_db

app = FastAPI(title="Ordain.Church API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    print("Initializing database...")
    init_db()
    print("Database initialized successfully")

# Include routers
app.include_router(auth.router)
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(marriage_laws.router)
app.include_router(ceremony_builder.router)
app.include_router(certificates.router)

# Serve static frontend
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ordain.church"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
