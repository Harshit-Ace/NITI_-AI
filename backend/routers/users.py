from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from schemas.user_profile import UserProfileUpdate, UserProfileResponse
from db.mongo import get_database
from core.dependencies import get_current_user_id, get_current_user

router = APIRouter()


@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(
    current_user=Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user = await db["users"].find_one({"_id": current_user})
    return user.get("profile", {})


@router.put("/profile", response_model=UserProfileResponse)
async def update_profile(
    payload: UserProfileUpdate,
    current_user=Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await db["users"].update_one(
        {"_id": current_user},
        {"$set": {"profile": payload.dict(exclude_unset=True)}},
    )

    user = await db["users"].find_one({"_id": current_user})
    return user.get("profile", {})
