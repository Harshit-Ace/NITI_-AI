from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.dependencies import get_db, get_current_user_id
from schemas.auth import UserCreate, UserResponse
from services.auth_service import AuthService

router = APIRouter()


@router.post("/signup")
async def signup(
    payload: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = AuthService(db)
    return await service.signup(payload)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = AuthService(db)

    return await service.login(
        form_data.username,
        form_data.password
    )


@router.get("/me", response_model=UserResponse)
async def me(
    user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    service = AuthService(db)
    return await service.get_me(user_id)