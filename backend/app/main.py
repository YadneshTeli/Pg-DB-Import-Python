from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .routers import import_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(title="PostgreSQL Data Import API")

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(import_routes.router, prefix="/api", tags=["import"])

@app.get("/")
async def root():
    return {"message": "PostgreSQL Data Import API"}
