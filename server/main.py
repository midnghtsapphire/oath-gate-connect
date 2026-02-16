"""
Ordain.Church - Spiritual Platform API
Complete ordination and marriage ceremony platform
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from routes import auth, billing, marriage_laws, ceremony_builder, certificates

app = FastAPI(title="Ordain.Church API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(billing.router)
app.include_router(marriage_laws.router)
app.include_router(ceremony_builder.router)
app.include_router(certificates.router)

# Serve static frontend
if os.path.exists("../dist"):
    app.mount("/", StaticFiles(directory="../dist", html=True), name="static")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ordain.church"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
