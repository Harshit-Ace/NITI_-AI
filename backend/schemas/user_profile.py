from typing import Optional
from pydantic import BaseModel


class UserProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    income: Optional[int] = None
    category: Optional[str] = None


class UserProfileResponse(UserProfileUpdate):
    pass
