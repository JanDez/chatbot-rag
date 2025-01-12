from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat, user_activity
from .core.events import startup_event
from .db.db_connection import engine
from .db.db_models import Base

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "https://chatbot-rag-frontend-production.up.railway.app",
        "https://chatbot-rag-backend-production.up.railway.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the startup event
@app.on_event("startup")
async def startup():
    await startup_event(app)

# Add after the app is created but before the routers
@app.on_event("startup")
async def init_db():
    Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(chat.router)
app.include_router(user_activity.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)