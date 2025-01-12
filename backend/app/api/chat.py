from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..services.chat_service import ChatService
from ..services.embedding_service import EmbeddingService
from sqlalchemy.orm import Session
from ..db.db_connection import get_db
from ..db.db_models import Conversation, Interaction
import logging

from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()
chat_service = ChatService()

# Request models for API endpoints
class ChatRequest(BaseModel):
    message: str
    company_name: str
    chat_name: str = "Promtior AI Assistant"
    user_email: str

class UserActivity(BaseModel):
    user_email: str
    user_name: str
    interactions: list

# Main chat endpoint for handling user messages
@router.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = chat_service.generate_response(
            request.message,
            request.company_name,
            request.chat_name
        )
        return {"reply": response}
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Initialize embeddings and other necessary data
@router.post("/api/initialize")
async def initialize_data():
    try:
        logger.info("Starting data initialization...")
        embedding_service = EmbeddingService()
        embedding_service._initialize_data()
        
        logger.info("Data initialized successfully")
        return {"message": "Data initialized successfully"}
    except Exception as e:
        logger.error(f"Error in initialization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Log user interactions with the chatbot
async def log_interaction(activity: UserActivity, db: Session = Depends(get_db)):
    try:
        # Search or create a conversation for this user
        conversation = db.query(Conversation).filter(
            Conversation.user_email == activity.user_email
        ).first()
        
        if not conversation:
            # Create new conversation if none exists
            conversation = Conversation(
                user_email=activity.user_email,
                user_name=activity.user_name
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # Add new interactions to the conversation
        for interaction in activity.interactions:
            new_interaction = Interaction(
                conversation_id=conversation.id,
                timestamp=datetime.fromisoformat(interaction["timestamp"].replace("Z", "+00:00")),
                user_message=interaction["user_message"],
                bot_response=interaction["bot_response"]
            )
            db.add(new_interaction)

        db.commit()
        return {"message": "Interactions logged successfully"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error logging interaction: {str(e)}")
        raise HTTPException(status_code=500, detail="Error logging interaction")

# Retrieve all interactions for admin dashboard
async def get_all_interactions(db: Session = Depends(get_db)):
    try:
        # Get all conversations from database
        conversations = db.query(Conversation).all()
        
        # Format the response with all interactions
        response_data = []
        for conversation in conversations:
            interactions = db.query(Interaction).filter(Interaction.conversation_id == conversation.id).all()
            response_data.append({
                "user_email": conversation.user_email,
                "user_name": conversation.user_name,
                "interactions": [
                    {
                        "timestamp": interaction.timestamp.isoformat(),
                        "user_message": interaction.user_message,
                        "bot_response": interaction.bot_response
                    }
                    for interaction in interactions
                ]
            })
        
        return response_data
    except Exception as e:
        logger.error(f"Error getting interactions: {str(e)}")
        raise HTTPException(status_code=500, detail="Error getting interactions")

# Search interactions by username with fuzzy matching
async def search_interactions(user_name: str, db: Session = Depends(get_db)):
    try:
        # Log the search attempt for debugging
        logger.info(f"Searching for user_name: {user_name}")
        
        # Get all conversations that match the username using case-insensitive search
        conversations = db.query(Conversation).filter(
            Conversation.user_name.ilike(f"%{user_name}%")
        ).all()
        
        if not conversations:
            return []
            
        # Format the response with matched conversations
        response_data = []
        for conversation in conversations:
            try:
                # Get interactions ordered by most recent first
                interactions = db.query(Interaction).filter(
                    Interaction.conversation_id == conversation.id
                ).order_by(Interaction.timestamp.desc()).all()
                
                response_data.append({
                    "user_email": conversation.user_email,
                    "user_name": conversation.user_name,
                    "interactions": [
                        {
                            "timestamp": interaction.timestamp.isoformat(),
                            "user_message": interaction.user_message,
                            "bot_response": interaction.bot_response
                        }
                        for interaction in interactions
                    ]
                })
            except Exception as inner_e:
                logger.error(f"Error processing conversation {conversation.id}: {str(inner_e)}")
                continue
        
        return response_data
    except Exception as e:
        logger.error(f"Error searching interactions: {str(e)}")
        return []  # Return empty list instead of raising an exception

# Get interactions for a specific user by email
async def get_interactions(user_email: str, db: Session = Depends(get_db)):
    try:
        # Get user's conversation by email
        conversation = db.query(Conversation).filter(Conversation.user_email == user_email).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="No interactions found for this user.")
        
        # Get all interactions associated with the conversation
        interactions = db.query(Interaction).filter(Interaction.conversation_id == conversation.id).all()
        
        # Format the response with user's interactions
        response_data = {
            "user_email": conversation.user_email,
            "user_name": conversation.user_name,
            "interactions": [
                {
                    "timestamp": interaction.timestamp.isoformat(),
                    "user_message": interaction.user_message,
                    "bot_response": interaction.bot_response
                }
                for interaction in interactions
            ]
        }
        
        return response_data
    except Exception as e:
        logger.error(f"Error getting interactions: {str(e)}")
        raise HTTPException(status_code=500, detail="Error getting interactions")