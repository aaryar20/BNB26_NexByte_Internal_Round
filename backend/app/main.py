from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.database.database import Base, engine
from app.models import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CreatorAi API",
    description="AI-powered creator operating platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "CreatorAi backend is running",
        "status": "online"
    }