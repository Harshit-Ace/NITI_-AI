from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.security import hash_password, verify_password, create_access_token
from schemas.auth import UserCreate
from utils.ids import generate_id


class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.users = db["users"]

    # ---------------- SIGNUP ----------------
    async def signup(self, user_in: UserCreate):
        existing = await self.users.find_one({"email": user_in.email})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user_id = generate_id()
        user_doc = {
            "_id": user_id,
            "email": user_in.email,
            "hashed_password": hash_password(user_in.password),
            "full_name": user_in.full_name,
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
        }

        await self.users.insert_one(user_doc)

        token = create_access_token(user_id)
        return {"access_token": token, "token_type": "bearer"}

    # ---------------- LOGIN ----------------
    async def login(self, email: str, password: str):
        user = await self.users.find_one({"email": email})
        
        if not user or not verify_password(password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Email or password",
            )

        token = create_access_token(user["_id"])
        return {"access_token": token, "token_type": "bearer"}

    # ---------------- GET CURRENT USER ----------------
    async def get_me(self, user_id: str):
        user = await self.users.find_one(
            {"_id": user_id},
            {"hashed_password": 0}
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return self._serialize_user(user)

    # ---------------- SERIALIZER ----------------
    def _serialize_user(self, user: dict) -> dict:
        return {
            "id": user["_id"],
            "email": user["email"],
            "full_name": user.get("full_name"),
            "is_active": user["is_active"],
            "created_at": user["created_at"],
        }
