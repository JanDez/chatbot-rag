from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class UserActivity(BaseModel):
    email: str
    name: str

@router.post("/api/log_user_activity")
async def log_user_activity(activity: UserActivity):
    try:
        logger.info(f"User activity received: {activity.email}, {activity.name}")
        return {"message": "User activity logged successfully"}
    except Exception as e:
        logger.error(f"Error logging user activity: {str(e)}")
        raise HTTPException(status_code=500, detail="Error logging user activity")

@router.options("/api/log_user_activity")
async def options_log_user_activity():
    return {} 