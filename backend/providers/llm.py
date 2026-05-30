from abc import ABC, abstractmethod
from groq import AsyncGroq
from core.config import settings


# ===============================
# Base Interface
# ===============================
class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str) -> str:
        pass


# ===============================
# Groq Implementation
# ===============================
class GroqLLMProvider(BaseLLMProvider):
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    async def generate(self, prompt: str) -> str:
        response = await self.client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful Government Scheme Assistant for India. "
                        "Answer clearly and concisely."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0,
        )

        return response.choices[0].message.content


# ===============================
# Active Provider (GLOBAL)
# ===============================
llm_provider: BaseLLMProvider = GroqLLMProvider()