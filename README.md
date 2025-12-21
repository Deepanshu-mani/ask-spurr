# AI Live Chat Agent - Assignment Submission

This repository contains the source code for the AI Live Chat Support Agent.

## 🚀 How to Run Locally

### Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally or via a provider like Neon)
- Google AI Studio API Key

### Step 1: Backend Setup

Open a terminal in the `backend` directory:

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure Environment Variables
cp .env.example .env
```

Edit the `.env` file with your credentials:

- `DATABASE_URL`: Your PostgreSQL connection string.
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key.
- `FRONTEND_URL`: `http://localhost:5173` (default)

### Step 2: Database Setup

Initialize the database schema using Prisma:

```bash
# Apply migrations to creating tables (Conversation, Message)
npx prisma migrate deploy

# (No seeding required - the app starts fresh)
```

### Step 3: Run Backend

```bash
npm run dev
# Server starts on http://localhost:3000
```

### Step 4: Frontend Setup

Open a **new terminal** in the `frontend` directory:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run Frontend
npm run dev
# App starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser to test the application.

---

## 🏗️ Architecture Overview

The project follows a **Layered Architecture** to separate concerns and ensure maintainability.

### Backend Structure (`backend/src`)

- **`routes/`**: Defines API endpoints (`/chat/*`, `/health`).
- **`controllers/`**: Handles HTTP request/response logic, input validation (Zod), and error formatting.
- **`services/`**: Contains the core business logic.
  - `chatService.ts`: Manages conversation history and database operations.
  - `llmService.ts`: Encapsulates all Gemini AI interactions and prompt logic.
  - `faqService.ts`: Provides the static knowledge base.
- **`prisma/`**: Database schema definition.

### Design Decisions

1.  **Reactive Store (Frontend)**: All frontend logic (offline sync, heartbeat, API calls) is centralized in a Svelte 5 Reactive Store (`chatStore.svelte.ts`). This keeps the UI components "dumb" and purely for rendering.
2.  **Stateless API**: The backend is RESTful and uses the `sessionId` passed in each request to retrieve context, making the service easily scalable.
3.  **Resilience First**: The system includes a custom "Heartbeat" mechanism with exponential backoff to handle server outages gracefully, and a "Batch Sync" system to recover context when coming back online.
4.  **Mobile-First Responsive Design**: The UI is fully responsive with optimized layouts for mobile, tablet, and desktop - including compact headers, docked input areas on mobile, and horizontal card layouts for better touch interactions.

---

## 🤖 LLM Notes

### Provider

**Google Gemini 2.0 Flash (Experimental)**

- Selected for its speed and superior reasoning capabilities compared to smaller models.
- Accessed via the `Google Generative AI SDK`.

### Prompting Strategy

I used a focused **System Prompt** that enforces a specific persona and constraints:

1.  **Role Definition**: "Helpful support agent for ShopEase".
2.  **Knowledge Injection**: Hardcoded FAQ text (Shipping, Returns, Support hours) is injected directly into the system prompt.
3.  **Context Window**: The last 5 messages of the conversation are appended to every request to ensure continuity without exceeding token limits.

---

## ⚖️ Trade-offs & "If I had more time..."

### Trade-offs

1.  **Hardcoded FAQ**: For this assignment, the knowledge base is a static string. In a real production app, this would be retrieved from a Vector Database (RAG) to scale to thousands of documents.
2.  **No Authentication**: To focus on the core chat mechanics, I used `localStorage` to generate and persist a random Session ID. Production would require JWT/OAuth.
3.  **Polling vs Sockets**: I implemented a robust polling mechanism (Heartbeat) for reconnection. For a chat app at scale, WebSockets or Server-Sent Events (SSE) would be more efficient for real-time updates.

### "If I had more time..."

1.  **Streaming Responses**: Implement Vercel AI SDK's streaming on the frontend to show the AI typing character-by-character.
2.  **Unit Tests**: Add Jest/Vitest tests for the `ChatStore` logic (specifically the offline queue and retry mechanisms).
3.  **Admin Dashboard**: A simple page to view all active conversations stored in the database.
