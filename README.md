# Ask-Spurr — AI Live Chat Agent

A production-quality AI-powered customer support chat agent built for the Spur founding engineer take-home assignment.

**Live Demo:** _(deploy URL here)_

---

## 🚀 How to Run Locally

### Prerequisites

- Node.js (v18+)
- PostgreSQL (running locally or via a provider like Neon)
- Google AI Studio API Key ([get one free here](https://aistudio.google.com/))

### Step 1: Clone & Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

### Step 2: Database Setup

```bash
# Apply migrations to create tables (Conversation, Message, ConversationMetadata)
npx prisma migrate deploy
```

> No seeding needed — the app starts fresh automatically.

### Step 3: Run Backend

```bash
npm run dev
# Server starts on http://localhost:3000
```

### Step 4: Setup & Run Frontend

Open a **new terminal** in the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
# App starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Architecture Overview

The project follows a **Layered Architecture** for clean separation of concerns.

```
spurr/
├── backend/
│   └── src/
│       ├── routes/         → API route definitions (/chat/*, /health)
│       ├── controllers/    → HTTP request/response + input validation
│       ├── middleware/      → Global error handler, Zod validation, asyncHandler wrapper
│       ├── services/
│       │   ├── chatService.ts       → Conversation DB operations
│       │   ├── llmService.ts        → Gemini AI call, prompt building, model fallback
│       │   ├── faqService.ts        → Static knowledge base (FAQ context)
│       │   ├── entityExtractor.ts   → Extracts order/tracking numbers from messages
│       │   └── metadataService.ts   → Persists extracted entities to DB
│       └── index.ts        → Express app, CORS, process-level safety nets
│
└── frontend/
    └── src/
        ├── routes/+page.svelte       → Main page layout
        ├── lib/
        │   ├── stores/chatStore.svelte.ts  → All chat logic (API, state, offline sync)
        │   └── components/
        │       ├── ChatHeader.svelte
        │       ├── ChatInput.svelte
        │       ├── MessageBubble.svelte    → Renders markdown + rich order cards
        │       ├── WelcomeScreen.svelte    → Landing screen with quick-action cards
        │       └── TypingIndicator.svelte
        └── lib/demo/agentSnapshot.ts  → Mock order data for the UI
```

### Key Design Decisions

1. **Reactive Store (Frontend):** All business logic — API calls, offline sync, session management, heartbeat — lives in a single Svelte 5 reactive class (`chatStore.svelte.ts`). UI components are purely presentational.

2. **Stateless REST API:** The backend is fully stateless. Each request passes a `sessionId` and the server fetches history from the DB, making the service horizontally scalable.

3. **Entity Extraction Layer:** Before generating a reply, the system runs a lightweight LLM call to extract structured data (order numbers, tracking numbers, emails) from the user's message. This is saved to `ConversationMetadata` so the AI can reference it contextually across the session — similar to how a real Spur support agent would remember what order a customer is asking about.

4. **Generative UI (Order Cards):** The LLM is instructed to output a special token `[ORDER_CARD:ORDER_ID]` in its response. The frontend intercepts this token and renders a rich interactive UI card with the product image, order status, and summary — instead of plain text. This is the same pattern used by modern AI chat products.

5. **Model Fallback Chain:** The backend tries a prioritized list of Gemini models in order. If any model hits a rate limit or error, it automatically falls back to the next one:
   `gemini-2.5-flash-lite` → `gemini-2.5-flash` → `gemini-2.0-flash-exp` → `gemini-1.5-flash`

6. **Resilience & Offline Recovery:** The frontend implements a Heartbeat mechanism with exponential backoff to detect when the backend recovers. Unsent messages are queued and synced automatically when connectivity restores.

7. **Process-level Safety Nets:** `process.on('uncaughtException')` and `process.on('unhandledRejection')` are registered to prevent the Node.js process from crashing on unexpected errors. JSON body size is capped at 50kb to prevent payload attacks.

---

## 🤖 LLM Notes

### Provider

**Google Gemini** (via Vercel AI SDK + `@ai-sdk/google`)

- Selected for its speed, strong reasoning, and generous free tier.
- Falls back through 4 models automatically on failure or rate limit.
- If every model fails, a friendly human-readable error is always returned to the user — never a blank response.

### Prompting Strategy

A focused **System Prompt** with four layers:

1. **Role Definition:** Calm, concise Spurr support representative tone.
2. **Behavior Rules:** Only answer from the knowledge base. Never invent policies. Offer human handoff when outside scope.
3. **Knowledge Injection:** FAQ context (Shipping, Returns, Support Hours, Payments, Promotions, etc.) is injected directly into every system prompt.
4. **Customer Context:** Extracted metadata (order numbers, tracking numbers, etc.) is appended to personalize responses within the session.

### Cost Control

- Only the **last 5 messages** of history are sent per request. 
- Responses are kept short (1–4 sentences) via the system prompt.

---

## ⚖️ Trade-offs & "If I Had More Time..."

### Trade-offs Made

| Decision | Reason |
|---|---|
| **No streaming responses** | For support chat, responses are short (1–4 sentences). Full streaming would add significant frontend complexity (SSE, partial state, cursor animation) for minimal UX gain. The Typing Indicator gives a great perceived-performance feel instead. |
| **Hardcoded FAQ** | Static string in `faqService.ts`. In production this would be a Vector DB (RAG) to scale to thousands of articles. |
| **No authentication** | `localStorage` session ID is sufficient for the assignment scope. Production would use JWT/OAuth. |
| **REST over WebSockets** | REST is simpler to deploy and reason about. A heartbeat + exponential backoff handles the reconnection case cleanly without WebSocket complexity. |
| **Mock order data on frontend** | The `agentSnapshot.ts` demo orders are frontend-only for the Generative UI cards. In production, the backend would fetch real orders from a Shopify/DB integration. |

### If I Had More Time and if you would have asked...

1. **Token streaming:** Hook up SSE streaming from the Vercel AI SDK to the frontend so users see the AI typing word-by-word — especially useful for longer responses.
2. **Unit & integration tests:** Vitest tests for `chatStore` (offline queue, retry logic) and backend service tests for the entity extractor and LLM service.
3. **Vector search / RAG:** Replace the static FAQ string with embeddings + Postgres `pgvector` so the agent can search thousands of knowledge base articles dynamically.
4. **Past Chat Screen:** A simple sideview to view all active conversations, and full message history and continue the conversations.
5. **Multi-tenant sessions:** Proper user auth + per-user session isolation for a real multi-customer deployment.
