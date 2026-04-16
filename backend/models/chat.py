from datetime import datetime
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class Chat(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    title: str
    created_at: datetime = Field(
    default_factory=lambda: datetime.now(timezone.utc)
)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
