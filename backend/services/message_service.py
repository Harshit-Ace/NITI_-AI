from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from schemas.message import MessageSend, MessageResponse
from utils.ids import generate_id

from agents.graph import agent_graph
from agents.state import AgentState, ChatMessage, UserProfile


class MessageService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.messages = db["messages"]
        self.chats = db["chats"]
        self.users = db["users"]

    async def send_message(self, user_id: str, payload: MessageSend):
        # =====================================================
        # 1️⃣ Ownership check
        # =====================================================
        chat = await self.chats.find_one(
            {"_id": payload.chat_id, "user_id": user_id}
        )
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found",
            )

        # =====================================================
        # 2️⃣ Fetch chat history
        # =====================================================
        cursor = self.messages.find(
            {"chat_id": payload.chat_id}
        ).sort("created_at", 1)

        history = [
            ChatMessage(role=m["role"], content=m["content"])
            async for m in cursor
        ]

        # =====================================================
        # 3️⃣ Save user message
        # =====================================================
        user_msg = {
            "_id": generate_id(),
            "chat_id": payload.chat_id,
            "role": "user",
            "content": payload.content,
            "created_at": datetime.now(timezone.utc),
        }
        await self.messages.insert_one(user_msg)

        # =====================================================
        # 4️⃣ Load user profile (if exists)
        # =====================================================
        user = await self.users.find_one({"_id": user_id})

        profile = None
        if user and user.get("profile"):
            profile = UserProfile(**user["profile"])

        # =====================================================
        # 5️⃣ Run agent graph (chat / RAG / eligibility)
        # =====================================================
        state = AgentState(
            user_query=payload.content,
            chat_history=history,
            user_profile=profile,
        )

        result = await agent_graph.ainvoke(state)

        # =====================================================
        # 6️⃣ Save assistant message
        # =====================================================
        ai_msg = {
            "_id": generate_id(),
            "chat_id": payload.chat_id,
            "role": "assistant",
            "content": result["final_answer"],
            "sources": result.get("sources"),
            "created_at": datetime.now(timezone.utc),
        }
        await self.messages.insert_one(ai_msg)

        # =====================================================
        # 7️⃣ Return response (TEXT ONLY)
        # =====================================================
        return {
            "id": ai_msg["_id"],
            "chat_id": ai_msg["chat_id"],
            "role": ai_msg["role"],
            "content": ai_msg["content"],
            "sources": ai_msg.get("sources"),
            "created_at": ai_msg["created_at"],
        }

    async def get_chat_messages(self, user_id: str, chat_id: str):
        # =====================================================
        # Ownership check
        # =====================================================
        chat = await self.chats.find_one(
            {"_id": chat_id, "user_id": user_id}
        )

        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found",
            )

        # =====================================================
        # Fetch messages
        # =====================================================
        cursor = self.messages.find(
            {"chat_id": chat_id}
        ).sort("created_at", 1)

        messages = []
        async for m in cursor:
            messages.append(
                MessageResponse(
                    id=str(m["_id"]),
                    chat_id=m["chat_id"],
                    role=m["role"],
                    content=m["content"],
                    created_at=m["created_at"],
                )
            )

        return messages
