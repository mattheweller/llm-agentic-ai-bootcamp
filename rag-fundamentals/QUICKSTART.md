# RAG Fundamentals - Quick Start Guide

Get started with the interactive RAG & LangChain exercises in under 5 minutes.

## Prerequisites

- **Node.js 18+** installed
- **API Keys** configured in `.env` (root directory)
- **Web browser** (Chrome, Firefox, Safari, or Edge)

## Setup (One-Time)

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Configure API Keys

Ensure `.env` exists in the **repository root** with:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

**Security:** This file is gitignored - your keys never leave your machine.

## Running the Exercises

### Step 1: Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 LLM Bootcamp API Server running on http://localhost:3000
📋 Health check: http://localhost:3000/health
```

**Keep this terminal open** - the server must run while you work on exercises.

### Step 2: Open the Interactive Exercises

Open `rag-fundamentals/index.html` in your browser:

```bash
# From repository root
open rag-fundamentals/index.html

# Or double-click index.html in your file explorer
```

### Step 3: Try the Interactive Demo

1. Navigate to **Task 4: API Integration Demo**
2. Click "Check Server Health" - should show ✅ healthy status
3. Try the interactive chat and embedding examples

## What's Included

### Educational Tasks (1-3)
- **Task 1:** Project overview and learning objectives
- **Task 2:** Understanding RAG architecture
- **Task 3:** LangChain framework introduction

### Interactive Demo (Task 4)
- ✅ Server health verification
- 💬 Live chat with OpenAI and Claude
- 🔢 Embedding generation with visualization
- ⚠️ Error handling demonstrations

### API Client
- **File:** `assets/js/api-client.js`
- **Methods:** Chat, embeddings, streaming (Anthropic)
- **Providers:** OpenAI, Anthropic (Claude), Google (Gemini)

## Testing the Integration

### In Browser Console

```javascript
// Initialize client
const client = new LLMAPIClient('http://localhost:3000');

// Check health
const health = await client.checkHealth();
console.log(health);  // Should show all keys: true

// Simple chat
const response = await client.simpleChat('What is RAG?', 'openai');
console.log(response);

// Generate embedding
const embedding = await client.embed('Retrieval Augmented Generation', 'openai');
console.log(embedding.length);  // 1536
```

### Via cURL (Health Check)

```bash
curl http://localhost:3000/health
```

Expected output:
```json
{
  "status": "healthy",
  "apiKeys": {
    "openai": true,
    "anthropic": true,
    "google": true
  }
}
```

## Troubleshooting

### Server Won't Start

**Error:** `EADDRINUSE` (port already in use)

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### API Keys Not Loaded

**Error:** `OPENAI_API_KEY not configured`

1. Check `.env` file exists in **repository root** (not in `server/`)
2. Verify keys have no extra spaces or quotes
3. Restart server after updating `.env`

### Cannot Connect to Server

**Error:** `Request timeout - server may be down`

1. Ensure server is running (`cd server && npm run dev`)
2. Check console for errors
3. Verify server is on port 3000: `curl http://localhost:3000/health`

### Browser Console Errors

**Error:** `CORS policy`

- Server has CORS enabled for all origins
- Make sure you're using `localhost:3000` (not `127.0.0.1:3000`)

## File Structure

```
rag-fundamentals/
├── index.html                          # Landing page
├── QUICKSTART.md                       # This file
├── API-INTEGRATION-GUIDE.md            # Detailed API docs
├── assets/
│   ├── js/
│   │   ├── api-client.js              # ⭐ Secure LLM API wrapper
│   │   ├── navigation.js              # Progress tracking
│   │   └── code-interactions.js       # Syntax highlighting
│   ├── css/                           # Styles
│   ├── images/diagrams/               # SVG visualizations
│   └── data/                          # Restaurant data
└── tasks/
    ├── task-1-overview.html
    ├── task-2-understand-rag.html
    ├── task-3-langchain-101.html
    └── task-4-api-demo.html           # ⭐ Interactive demo
```

## Next Steps

1. ✅ Complete Tasks 1-4 to understand RAG fundamentals
2. 📖 Read `API-INTEGRATION-GUIDE.md` for detailed API examples
3. 🏗️ Build your own RAG exercises using the patterns in Task 4
4. 🔧 Explore the full API client in `assets/js/api-client.js`

## Need Help?

- **API Documentation:** `API-INTEGRATION-GUIDE.md`
- **Server Documentation:** `../server/README.md`
- **GitHub Issues:** Report bugs or ask questions

## Security Notes

✅ **Safe:**
- API keys stored server-side in `.env`
- All requests proxied through Express backend
- Keys never exposed to browser or client-side code

❌ **Never do this:**
- Commit `.env` to git (it's already in `.gitignore`)
- Hardcode API keys in HTML/JavaScript
- Share your `.env` file

---

**Ready to learn RAG?** Start the server and open `index.html`! 🚀
