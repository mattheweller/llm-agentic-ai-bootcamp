# LLM Bootcamp Server

Full-stack Express server that serves the RAG Fundamentals frontend and proxies LLM API requests to OpenAI, Anthropic, and Google.

## Features

- **Frontend Serving:** Serves the RAG Fundamentals interactive exercises from root (`/`)
- **Secure API Proxy:** API keys never exposed to browser - all LLM requests proxied through backend
- **Multi-provider:** Support for OpenAI, Anthropic (Claude), and Google (Gemini)
- **Health checks:** Verify API keys are loaded without exposing values
- **Single Server:** Both frontend and backend API on same port (3000)
- **Error handling:** Comprehensive error handling and logging

## Setup

### Install Dependencies

```bash
cd server
npm install
```

### Environment Variables

Ensure `.env` file exists in the **parent directory** with:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

## Running the Server

### Development (with auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## Frontend Serving

The server now serves both the backend API **and** the frontend static files.

### Request Routing

Requests are processed in this order:

1. **API Routes** (checked first for performance):
   - `/health` - Health check endpoint
   - `/api/openai/*` - OpenAI routes
   - `/api/anthropic/*` - Anthropic routes
   - `/api/google/*` - Google routes

2. **Static Files** (fallback):
   - `/` → Serves `rag-fundamentals/index.html`
   - `/tasks/*.html` → Serves task pages
   - `/assets/**/*` → Serves CSS, JavaScript, images, data files

3. **404 Handler**:
   - Returns JSON error for unmatched routes

### Frontend Access

After starting the server:
- **Homepage:** `http://localhost:3000`
- **Task pages:** `http://localhost:3000/tasks/task-1-overview.html`
- **Health check:** `http://localhost:3000/health` (JSON response)

**Key benefit:** No CORS issues - frontend and API share the same origin.

## API Endpoints

### Health Check

**GET** `/health`

Returns status of API keys (without exposing values):

```json
{
  "status": "healthy",
  "timestamp": "2024-02-24T11:19:00.000Z",
  "apiKeys": {
    "openai": true,
    "anthropic": true,
    "google": true
  }
}
```

---

### OpenAI Routes

#### Chat Completion

**POST** `/api/openai/chat`

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

#### Embeddings

**POST** `/api/openai/embeddings`

```json
{
  "model": "text-embedding-3-small",
  "input": "Text to embed"
}
```

#### List Models

**GET** `/api/openai/models`

---

### Anthropic Routes

#### Messages (Claude)

**POST** `/api/anthropic/messages`

```json
{
  "model": "claude-3-5-sonnet-20241022",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "max_tokens": 1024,
  "temperature": 0.7
}
```

#### Streaming Messages

**POST** `/api/anthropic/messages/stream`

Same request body as `/messages`, returns Server-Sent Events (SSE) stream.

---

### Google Routes

#### Generate Content (Gemini)

**POST** `/api/google/generate`

```json
{
  "model": "gemini-1.5-flash",
  "prompt": "Hello, how are you?",
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 1024
  }
}
```

#### Chat with History

**POST** `/api/google/chat`

```json
{
  "model": "gemini-1.5-flash",
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "model", "content": "Hi there!" },
    { "role": "user", "content": "How are you?" }
  ]
}
```

#### Embeddings

**POST** `/api/google/embeddings`

```json
{
  "model": "text-embedding-004",
  "content": "Text to embed"
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

Common status codes:
- `200` - Success
- `400` - Bad request (invalid parameters)
- `500` - Server error
- `503` - Service unavailable (missing API keys)

## Security Notes

- API keys are **never** sent to the browser
- All LLM requests are proxied through this backend
- CORS enabled for frontend integration
- Request logging for debugging (no sensitive data logged)

## Architecture

```
Frontend (browser)
    ↓
Express API Server (this)
    ↓
LLM Provider APIs (OpenAI/Anthropic/Google)
```

Keys flow: `.env` → Express server → LLM providers (never to browser)

## Next Steps

Once the server is running and `/health` confirms all keys are loaded, integrate frontend exercises to call these endpoints instead of making direct LLM API calls.
