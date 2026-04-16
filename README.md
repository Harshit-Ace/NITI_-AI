# 🏛️ NITI AI — Government Scheme Intelligence Platform (RAG)

NITI AI is an AI-powered **Government Scheme Recommendation & Guidance System** built using **Retrieval-Augmented Generation (RAG)**.  
It helps Indian citizens **discover relevant government schemes**, **check eligibility**, and **understand application steps** through a conversational, ChatGPT-like interface.

---

## 📸 Screenshots

> _Application flow showcasing scheme discovery, eligibility checks, and guided application steps._

<img width="800" height="400" alt="Screenshot 2026-01-14 160606" src="https://github.com/user-attachments/assets/628b0297-6f6b-4cc0-a985-08818063341c" />

<img width="800" height="400" alt="Screenshot 2026-01-14 160642" src="https://github.com/user-attachments/assets/0813a16e-1259-41a1-a61e-95b9e04f03da" />

<img width="800" height="400" alt="Screenshot 2026-01-14 160655" src="https://github.com/user-attachments/assets/8afc7322-e0b6-4238-b1f5-d27bfe19d32f" />

---

## 🚀 Problem Statement

Government welfare schemes in India are:
- Scattered across multiple portals
- Difficult to understand due to complex eligibility rules
- Hard to navigate for first-time applicants

As a result, **eligible citizens often miss benefits** simply due to lack of clarity.

---

## 💡 Solution

NITI AI solves this by:
- Indexing official government scheme data
- Using **semantic search (vector embeddings)** to retrieve relevant schemes
- Applying **RAG-based reasoning** to avoid hallucinations
- Providing **clear eligibility decisions and application steps**
- Offering a **chat-based experience** accessible to non-technical users

---

## 🧠 Key Features

- 🔍 **Semantic Scheme Discovery**
- 🤖 **RAG-based AI Responses (Grounded in Data)**
- ✅ **Eligibility Checking with Clear Reasoning**
- 📝 **Step-by-Step Application Guidance**
- 💬 **ChatGPT-like UI with Persistent Chats**
- 🔐 **JWT Authentication**
- 📂 **User-wise Chat History**

---

## 🏗️ System Architecture

**User (React UI)**  
⬇️  
**FastAPI Backend**  
⬇️  
**RAG Pipeline**
- **Hugging Face Embeddings** – semantic vector generation  
- **Pinecone Vector Database** – similarity search & retrieval  
- **MongoDB** – chats, messages, metadata storage  
- **Groq LLM** – grounded reasoning & response generation


---

## 🧩 Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python 3.11
- JWT Authentication

### AI / RAG
- Hugging Face Embeddings (`sentence-transformers/all-MiniLM-L6-v2`)
- Pinecone (Vector Database)
- Groq LLM API
- Custom RAG Pipeline (no heavy LangChain runtime dependency)

### Database
- MongoDB

### Deployment
- Modal (AI workloads)
- Render (API hosting)

---

## 🔁 RAG Pipeline Flow

1. Government scheme documents are **chunked**
2. Embeddings generated using **Hugging Face**
3. Stored in **Pinecone Vector DB**
4. User query → **semantic similarity search**
5. Top-K relevant chunks retrieved
6. LLM generates:
   - Scheme recommendation
   - Eligibility explanation
   - Application steps  
   (strictly grounded in retrieved context)
---

## 🔐 Environment Variables

```env
# MongoDB
MONGO_DB_URI=
MONGO_DB_NAME=

# JWT
JWT_SECRET_KEY=
JWT_ALGORITHM=

# AI
GROQ_API_KEY=

# Pinecone
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=

# Embeddings
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
