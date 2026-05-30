from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

from fastapi import HTTPException, status

from schemas.chat import ChatCreate
from utils.ids import generate_id

from providers.llm import llm_provider as groq_llm


class ChatService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db                 # 🔥 ADD THIS
        self.chats = db["chats"]
        self.messages = db["messages"]

    async def create_chat(self, user_id: str, payload: ChatCreate):
        chat_id = generate_id()

        chat_doc = {
            "_id": chat_id,
            "user_id": user_id,
            "title": payload.title,
            "created_at": datetime.now(timezone.utc),
           
        }

        await self.chats.insert_one(chat_doc)

        return {
            "id": chat_id,
            "title": payload.title,
            "created_at": chat_doc["created_at"],
           
        }

    async def list_chats(self, user_id: str):
        cursor = self.chats.find({"user_id": user_id})

        chats = []
        async for chat in cursor:
            chats.append(
                {
                    "id": chat["_id"],
                    "title": chat["title"],
                    "created_at": chat.get("created_at"),
                  
                }
            )

        return chats

    async def delete_chat(self, user_id: str, chat_id: str):
        result = await self.chats.delete_one(
            {"_id": chat_id, "user_id": user_id}
        )

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found",
            )

    async def auto_rename_chat(self, chat_id: str, user_id: str):
        chat = await self.chats.find_one(
            {
                "_id": chat_id,
                "user_id": user_id,
            }
        )

        if not chat:
            raise HTTPException(status_code=404)

        # ✅ fetch first 4 messages
        messages = await self.messages.find(
            {"chat_id": chat_id}
        ).sort("created_at", 1).to_list(length=4)

        if len(messages) < 2:
            return {"skipped": True}

        prompt = f"""
Generate a short, descriptive chat title (max 6 words).
Do NOT use quotes.

Conversation:
{chr(10).join(m["content"] for m in messages)}
"""

        title = await groq_llm.generate(prompt)

        clean_title = title.strip().replace("\n", "")[:60]

        await self.chats.update_one(
            {"_id": chat_id},
            {"$set": {"title": clean_title}},
        )

        return {"title": clean_title}
    


    async def manual_rename_chat(
        self,
        chat_id: str,
        user_id: str,
        title: str,
    ):
        title = title.strip()

        if not title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty",
            )

        result = await self.chats.update_one(
            {"_id": chat_id, "user_id": user_id},
            {"$set": {"title": title}},
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found",
            )

        return {
            "success": True,
            "chat_id": chat_id,
            "title": title,
        }
    

    
    async def get_chat(self, user_id: str, chat_id: str):
        chat = await self.chats.find_one(
            {"_id": chat_id, "user_id": user_id}
        )

        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found",
            )

        return {
            "id": chat["_id"],
            "title": chat["title"],
            "created_at": chat.get("created_at"),
           
        }