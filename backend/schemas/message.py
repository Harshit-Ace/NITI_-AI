from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class MessageSend(BaseModel):
    chat_id: str
    content: str


class MessageResponse(BaseModel):
    id: str
    chat_id: str
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
