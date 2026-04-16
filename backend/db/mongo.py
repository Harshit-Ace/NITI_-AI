from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from core.config import settings
import certifi  # 👈 add this at top

MONGODB_URI = settings.MONGO_DB_URI 
MONGODB_DB_NAME = settings.MONGO_DB_NAME

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


'''async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]'''


async def connect_to_mongo():
    global client, db
    try:
        import certifi
        client = AsyncIOMotorClient(
            MONGODB_URI,
            tls=True,
            tlsCAFile=certifi.where()
        )
        db = client[MONGODB_DB_NAME]

        # Test connection
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
