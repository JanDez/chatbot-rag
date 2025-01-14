from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat, user_activity
from .core.events import startup_event
from .db.db_connection import engine
from .db.db_models import Base
import os

app = FastAPI()

# Get environment and URLs from environment variables
ENV = os.getenv("ENV", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
RAILWAY_URL = "https://chatbot-rag-frontend-production.up.railway.app"

# Configure CORS - allow all origins in development
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
    "http://localhost:80",
    "http://localhost:3000",
    FRONTEND_URL,
    RAILWAY_URL,
    "https://chatbot-rag-frontend-production.up.railway.app",
    "https://chatbot-rag-backend-production.up.railway.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Register the startup event
@app.on_event("startup")
async def init_db():
    Base.metadata.create_all(bind=engine)

# Add after the app is created but before the routers
@app.on_event("startup")
async def init_db():
    Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(chat.router)
app.include_router(user_activity.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=ENV == "development"
    )