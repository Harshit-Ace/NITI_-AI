from langgraph.graph import StateGraph, END

from agents.state import AgentState
from agents.nodes.router import router_node
from agents.nodes.rag_node import rag_node
from agents.nodes.eligibility import eligibility_node
from agents.nodes.final_answer import final_answer_node


def build_agent_graph():
    graph = StateGraph(AgentState)

    # ---- Nodes ----
    graph.add_node("router", router_node)
    graph.add_node("rag", rag_node)
    graph.add_node("eligibility", eligibility_node)
    graph.add_node("final", final_answer_node)

    # ---- Entry ----
    graph.set_entry_point("router")

    # ---- Routing ----
    graph.add_conditional_edges(
        "router",
        lambda state: state.route or "chat",
        {
            "rag": "rag",
            "eligibility": "rag",
            "chat": "final",
        },
    )

    # ---- Flow ----
    graph.add_edge("rag", "eligibility")
    graph.add_edge("eligibility", "final")

    # ---- Exit ----
    graph.add_edge("final", END)

    return graph.compile()


# Singleton compiled graph
agent_graph = build_agent_graph()
