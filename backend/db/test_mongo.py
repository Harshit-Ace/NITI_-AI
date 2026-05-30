from pymongo import MongoClient
from core.config import settings

try:
    client = MongoClient(settings.MONGO_DB_URI)
    print(client.list_database_names())
    print("✅ MongoDB Connected")
except Exception as e:
    print("❌ Error:", e)