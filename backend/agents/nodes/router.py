from agents.state import AgentState

async def router_node(state: AgentState) -> AgentState:
    q = state.user_query.lower()

    # ---------------- ELIGIBILITY ----------------
    eligibility_keywords = [
        "am i eligible",
        "eligibility",
        "can i apply",
        "can i get",
        "do i qualify",
        "will i get",
        "is this for me",
        "qualify for",
        "eligible for",
    ]

    # ---------------- RAG (FACTUAL SCHEME DATA) ----------------
    rag_keywords = [
        # scheme discovery
        "scheme",
        "yojana",
        "government scheme",
        "central scheme",
        "state scheme",

        # categories
        "scholarship",
        "pension",
        "housing",
        "loan",
        "subsidy",
        "education",
        "farmer",
        "women",
        "senior citizen",
        "disabled",

        # eligibility attributes
        "age",
        "income",
        "state",
        "category",
        "caste",
        "bpl",
        "ews",

        # benefits
        "benefit",
        "amount",
        "money",
        "financial assistance",
        "interest",
        "coverage",
    ]

    # ---------------- CHAT (DEFAULT) ----------------
    chat_keywords = [
        "explain",
        "help me understand",
        "difference between",
        "which is better",
        "guide me",
        "what should i do",
        "next steps",
        "suggest",
        "recommend",
        "compare",
    ]

    # ---------- ROUTING PRIORITY (VERY IMPORTANT) ----------
    if any(k in q for k in eligibility_keywords):
        state.route = "eligibility"

    elif any(k in q for k in rag_keywords):
        state.route = "rag"

    elif any(k in q for k in chat_keywords):
        state.route = "rag"

    else:
        # SAFE FALLBACK
        state.route = "chat"

    print(f"[ROUTER] Route selected → {state.route}")
    return state
