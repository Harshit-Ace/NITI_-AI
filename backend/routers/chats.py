from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.dependencies import get_db, get_current_user_id
from schemas.chat import ChatCreate, ChatResponse, ChatRenamePayload

from services.chat_service import ChatService

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def create_chat(
    payload: ChatCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = ChatService(db)
    return await service.create_chat(user_id, payload)


@router.get("", response_model=list[ChatResponse])
async def list_chats(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = ChatService(db)
    return await service.list_chats(user_id)


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(
    chat_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = ChatService(db)
    await service.delete_chat(user_id, chat_id)

@router.post("/{chat_id}/rename")
async def rename_chat(
    chat_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = ChatService(db)
    return await service.auto_rename_chat(chat_id, user_id)

@router.post("/{chat_id}/rename/manual")
async def manual_rename_chat(
    chat_id: str,
    payload: ChatRenamePayload,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = ChatService(db)
    return await service.manual_rename_chat(
        chat_id=chat_id,
        user_id=user_id,
        title=payload.title,
    )


@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(
    chat_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = ChatService(db)
    return await service.get_chat(user_id, chat_id)