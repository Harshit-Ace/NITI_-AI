import modal
from pydantic import BaseModel
import os

# -------------------------
# Modal Image
# -------------------------
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi",            
        "sentence-transformers",
        "pinecone",
        "numpy",
    )
)

app = modal.App(
    "niti-ai-rag-worker",
    image=image,
    secrets=[modal.Secret.from_name("niti-ai-secrets")]
)


# -------------------------
# Request model
# -------------------------
class RAGRequest(BaseModel):
    query: str
    top_k: int = 5
    states: list[str] | None = None
    categories: list[str] | None = None
    level: str | None = None


# -------------------------
# Persistent RAG Worker
# -------------------------
@app.cls(
    cpu=4,
    memory=8192,
    max_containers=3,
    scaledown_window=120,
)
class RAGWorker:

    @modal.enter()
    def setup(self):
      from sentence_transformers import SentenceTransformer
      from pinecone import Pinecone
      import os

      print("Loading embedding model...")
      self.model = SentenceTransformer("all-MiniLM-L6-v2")

      print("Connecting to Pinecone...")
      pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
      self.index = pc.Index(os.environ["PINECONE_INDEX_NAME"])

      print("RAG worker ready")



    @modal.fastapi_endpoint(method="POST")
    def retrieve(self, request: RAGRequest):
        query_embedding = self.model.encode(request.query).tolist()

        filters = {}
        if request.states:
            filters["states"] = {"$in": [s.lower().strip() for s in request.states]}
        if request.categories:
            filters["categories"] = {"$in": [c.lower().strip() for c in request.categories]}
        if request.level:
            filters["level"] = request.level.lower().strip()

        result = self.index.query(
            vector=query_embedding,
            top_k=request.top_k,
            include_metadata=True,
            filter=filters if filters else None,
        )

        seen = set()
        chunks = []

        for match in result["matches"]:
            meta = match["metadata"]
            scheme_id = meta.get("scheme_id")

            if scheme_id in seen:
                continue
            seen.add(scheme_id)

            chunks.append({
                "content": meta.get("text"),
                "scheme_id": scheme_id,
                "scheme_name": meta.get("scheme_name"),
                "states": meta.get("states"),
                "categories": meta.get("categories"),
                "level": meta.get("level"),
                "chunk_index": meta.get("chunk_index"),
                "score": match["score"],
            })

        return {"chunks": chunks}
