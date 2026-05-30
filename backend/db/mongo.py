from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from core.config import settings
import certifi


MONGODB_URI = settings.MONGO_DB_URI
MONGODB_DB_NAME = settings.MONGO_DB_NAME

client = AsyncIOMotorClient(settings.MONGO_DB_URI)

db = client[settings.MONGO_DB_NAME]


async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=30000,
            tls=True,
            tlsAllowInvalidCertificates=True,  # ← bypasses the SSL handshake issue
        )
        db = client[MONGODB_DB_NAME]
        await client.admin.command("ping")
        print("✅ MongoDB Connected Successfully")
    except Exception as e:
        print("❌ MongoDB Connection Failed:", e)


async def close_mongo_connection():
    global client
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialized")
    return db