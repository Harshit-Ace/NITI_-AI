import os
import requests
from motor.motor_asyncio import AsyncIOMotorDatabase
from agents.state import RetrievedChunk


def _normalize_list(values):
    if not values:
        return None
    return [v.lower().strip() for v in values]


class RAGService:
    """
    Thin proxy over Modal RAG worker.
    Interface stays the SAME.
    """

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.rag_url = os.environ["RAG_WORKER_URL"]

    async def retrieve(
        self,
        query: str,
        top_k: int = 5,
        states: list[str] | None = None,
        categories: list[str] | None = None,
        level: str | None = None,
    ) -> list[RetrievedChunk]:

        states = _normalize_list(states)
        categories = _normalize_list(categories)
        level = level.lower().strip() if level else None

        payload = {
            "query": query,
            "top_k": top_k,
            "states": states,
            "categories": categories,
            "level": level,
        }

        response = requests.post(
            self.rag_url,
            json=payload,
            timeout=30,
        )
        response.raise_for_status()

        data = response.json()

        results: list[RetrievedChunk] = []

        for chunk in data.get("chunks", []):
            results.append(
                RetrievedChunk(
                    content=chunk["content"],
                    scheme_id=chunk["scheme_id"],
                    scheme_name=chunk.get("scheme_name"),
                    states=chunk.get("states"),
                    categories=chunk.get("categories"),
                    level=chunk.get("level"),
                    chunk_index=chunk.get("chunk_index"),
                )
            )

        return results
