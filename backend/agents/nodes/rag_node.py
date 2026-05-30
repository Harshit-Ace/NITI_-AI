from services.rag_service2 import RAGService
from agents.state import AgentState
from db.mongo import get_database


async def rag_node(state: AgentState) -> AgentState:

    db = get_database()
    rag = RAGService(db)

    # chunks = await rag.retrieve(
    #     query=state.user_query,
    #     states=[state.user_profile.state] if state.user_profile else None,
    #     categories=[state.user_profile.category] if state.user_profile else None,
    # )

    try:
        chunks = await rag.retrieve(
            query=state.user_query,
            states=None,
            categories=None,
        )
    except Exception as exc:
        print(f"[RAG NODE] Failed to retrieve RAG chunks: {exc}")
        chunks = []

    state.retrieved_chunks = chunks

    return state
