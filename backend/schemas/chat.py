from datetime import datetime
from pydantic import BaseModel

from typing import Any, Optional
# -------- Requests --------
class ChatCreate(BaseModel):
    title: str


# -------- Responses --------
class ChatResponse(BaseModel):
    id: str
    title: str
    created_at: datetime


class ChatRenamePayload(BaseModel):
    title: str
