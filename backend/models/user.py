from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    income: Optional[int] = None
    category: Optional[str] = None


class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True

    # ✅ NEW (used by eligibility / agent)
    profile: Optional[UserProfile] = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
