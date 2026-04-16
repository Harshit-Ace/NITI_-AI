from fastapi import FastAPI
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from db.mongo import connect_to_mongo, close_mongo_connection
from routers import auth, chats, messages, users

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):#python -m venv c:\Users\Harshit\Documents\NITI-AI\.venv1
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="Niti AI: Government Scheme Assistant",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NITI AI Backend Running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth")
app.include_router(chats.router, prefix="/chats")
app.include_router(messages.router, prefix="/messages")
app.include_router(users.router, prefix="/users")

