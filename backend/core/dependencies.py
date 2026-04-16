from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.security import decode_access_token
from db.mongo import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# -------- DB Dependency --------
async def get_db() -> AsyncIOMotorDatabase:
    return get_database()


# -------- Auth Dependency --------
async def get_current_user_id(
    token: str = Depends(oauth2_scheme),
) -> str:
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return user_id



async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user = await db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user