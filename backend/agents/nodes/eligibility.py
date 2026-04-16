from agents.state import AgentState
from providers.llm import llm_provider
import json


async def eligibility_node(state: AgentState) -> AgentState:
    # Eligibility is OPTIONAL enrichment
    if not state.user_profile or not state.retrieved_chunks:
        return state

    for chunk in state.retrieved_chunks:
        prompt = f"""
You are checking eligibility for a government scheme.

User profile:
- Age: {state.user_profile.age}
- Gender: {state.user_profile.gender}
- State: {state.user_profile.state}
- Category: {state.user_profile.category}
- Income: {state.user_profile.income}

Scheme:
{chunk.content}

Decide if the scheme MAY apply.
If unsure, mark applicable as null.

Return ONLY JSON:
{{
  "applicable": true | false | null,
  "reason": "short reason"
}}
"""

        response = await llm_provider.generate(prompt)

        try:
            data = json.loads(response)
            chunk.applicable = data.get("applicable")
            chunk.applicability_reason = data.get("reason")
        except Exception:
            chunk.applicable = None
            chunk.applicability_reason = "Eligibility conditions not clearly specified."

    return state
