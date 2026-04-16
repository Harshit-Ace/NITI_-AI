from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.dependencies import get_db, get_current_user_id
from schemas.message import MessageSend, MessageResponse
from services.message_service import MessageService

router = APIRouter()


@router.post("/send", response_model=MessageResponse)
async def send_message(
    payload: MessageSend,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = MessageService(db)
    return await service.send_message(user_id, payload)


@router.get("/{chat_id}", response_model=list[MessageResponse])
async def get_chat_messages(
    chat_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = MessageService(db)
    return await service.get_chat_messages(user_id, chat_id)