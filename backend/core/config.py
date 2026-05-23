from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # MongoDB
    MONGO_DB_URI: str
    MONGO_DB_NAME: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str

    # AI
    GROQ_API_KEY: str

    # Pinecone (Vector DB)
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str
    PINECONE_INDEX_NAME: str

    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # RAG Worker
    RAG_WORKER_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",          
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()