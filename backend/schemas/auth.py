from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from pydantic import Field

# -------- Requests --------
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# -------- Responses --------
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime
