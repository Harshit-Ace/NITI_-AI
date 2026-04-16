from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class RetrievedChunk(BaseModel):
    content: str
    scheme_id: str
    scheme_name: str
    states: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    level: Optional[str] = None
    chunk_index: int
     # ---- Eligibility ----
    applicable: Optional[bool] = None
    applicability_reason: Optional[str] = None


class UserProfile(BaseModel):
    age: Optional[int] = None
    income: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None


class AgentState(BaseModel):
    # ---- Inputs ----
    user_query: str
    chat_history: List[ChatMessage] = Field(default_factory=list)
    user_profile: Optional[UserProfile] = None

    # ---- RAG ----
    retrieved_chunks: List[RetrievedChunk] = Field(default_factory=list)

    # ---- Control ----
    route: Optional[str] = None  # "chat" | "rag" | "eligibility"

    # ---- Outputs ----
    final_answer: Optional[str] = None
    sources: List[Dict[str, Any]] = Field(default_factory=list)
