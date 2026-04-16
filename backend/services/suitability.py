from typing import List
from providers.llm import llm_provider as groq_llm
from agents.state import UserProfile


async def assess_suitability(
    chunks: List[dict],
    user_profile: UserProfile | None,
    user_query: str,
) -> bool:
    """
    Decide if at least ONE retrieved scheme is clearly suitable
    for the user's intent and profile.

    chunks: list of dicts from `sources`
    """

    if not chunks:
        return False

    summaries = []

    for c in chunks[:5]:
        scheme_name = c.get("scheme_name", "Unknown scheme")
        summaries.append(f"- {scheme_name}")

    prompt = f"""
You are deciding whether government schemes are suitable for a user.

IMPORTANT:
- Be conservative.
- If suitability is unclear, answer NO.
- Do NOT assume missing details.
- Do NOT explain your answer.

User Query:
{user_query}

User Profile:
{user_profile}

Schemes:
{chr(10).join(summaries)}

Task:
Decide if at least ONE scheme is clearly suitable.

Answer ONLY one word:
YES or NO
"""
    print(user_query)
    print(user_profile)
    verdict = await groq_llm.generate(prompt)
    print("Suitability verdict:", verdict)
    return verdict.strip().upper() == "YES"
