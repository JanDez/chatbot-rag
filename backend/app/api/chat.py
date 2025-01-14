
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from ..services.chat_service import ChatService
from ..services.embedding_service import EmbeddingService
from sqlalchemy.orm import Session
from ..db.db_connection import get_db
from ..db.db_models import Conversation, Interaction
import logging
from fastapi.responses import JSONResponse
import asyncio
from typing import List, Optional

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
        logger.info(f"Received chat request from {request.user_email}")
        logger.info(f"Message: {request.message}")
        
        if not request.message:
            raise ValueError("Message cannot be empty")
            
        response = chat_service.generate_response(
            request.message,
            request.company_name,
            request.chat_name
        )
        
        logger.info(f"Generated response: {response}")
        return {"reply": response}
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error occurred")

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
@router.get("/api/interactions")
async def get_all_interactions(
    request: Request,
    db: Session = Depends(get_db),
    timeout: Optional[float] = 30.0
):
    try:
        # Add timeout to the database query
        result = await asyncio.wait_for(
            get_interactions_from_db(db),
            timeout=timeout
        )
        return JSONResponse(
            content=result,
            status_code=200
        )
    except asyncio.TimeoutError:
        logger.error("Request timeout getting interactions")
        raise HTTPException(
            status_code=504,
            detail="Request timeout"
        )
    except Exception as e:
        logger.error(f"Error getting interactions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error getting interactions"
        )

async def get_interactions_from_db(db: Session):
    conversations = db.query(Conversation).all()
    return [
        {
            "user_email": conv.user_email,
            "user_name": conv.user_name,
            "interactions": [
                {
                    "timestamp": inter.timestamp.isoformat(),
                    "user_message": inter.user_message,
                    "bot_response": inter.bot_response
                }
                for inter in db.query(Interaction)
                .filter(Interaction.conversation_id == conv.id)
                .all()
            ]
        }
        for conv in conversations
    ]

# Search interactions by username with fuzzy matching
@router.get("/api/interactions/search")
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

# Add this route after the existing routes
@router.get("/api/interactions/{user_email}")
async def get_user_interactions(user_email: str, db: Session = Depends(get_db)):
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