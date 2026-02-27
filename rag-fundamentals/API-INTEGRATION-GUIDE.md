# API Integration Guide for RAG Fundamentals

This guide explains how interactive exercises in this module securely connect to LLM providers (OpenAI, Anthropic, Google) through our Express backend.

## Architecture Overview

```
Frontend (Browser)           Backend (Express)         LLM Providers
    │                             │                         │
    │  HTTP Request               │                         │
    │  /api/openai/chat      ──>  │                         │
    │                              │  API Request           │
    │                              │  (with API key)   ──>  │
    │                              │                         │
    │                              │  <──  Response          │
    │  <──  Response               │                         │
    │                              │                         │
```

**Security:** API keys are stored server-side in `.env` and **never** exposed to the browser.

## Quick Start

### 1. Start the Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Start server
npm run dev
```

Server runs on `http://localhost:3000`

### 2. Verify Server Health

Open your browser's console and run:

```javascript
const client = new LLMAPIClient('http://localhost:3000');
const health = await client.checkHealth();
console.log(health);
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-24T...",
  "apiKeys": {
    "openai": true,
    "anthropic": true,
    "google": true
  }
}
```

## Using the API Client

### Load the API Client

Add to your HTML file (before your custom scripts):

```html
<script src="../assets/js/api-client.js"></script>
```

### Initialize Client

```javascript
const apiClient = new LLMAPIClient('http://localhost:3000');
```

### Simple Chat Example

```javascript
// Ask a question
const response = await apiClient.simpleChat(
  'What is RAG?',
  'openai',  // or 'anthropic' or 'google'
  { temperature: 0.7 }
);

console.log(response);  // AI's text response
```

### Multi-turn Conversation

```javascript
// OpenAI format
const messages = [
  { role: 'system', content: 'You are a helpful RAG tutor.' },
  { role: 'user', content: 'What is RAG?' },
  { role: 'assistant', content: 'RAG stands for...' },
  { role: 'user', content: 'How does it work?' }
];

const result = await apiClient.openaiChat(messages);
console.log(result.choices[0].message.content);
```

### Generate Embeddings

```javascript
// Get embedding vector for semantic search
const embedding = await apiClient.embed(
  'Retrieval Augmented Generation',
  'openai'
);

console.log(embedding);        // Array of 1536 numbers
console.log(embedding.length); // 1536
```

### Streaming Responses (Anthropic)

```javascript
await apiClient.anthropicMessagesStream(
  [{ role: 'user', content: 'Explain RAG' }],
  (event) => {
    // Handle each streaming chunk
    if (event.type === 'content_block_delta') {
      const text = event.delta.text;
      console.log(text);  // Stream text as it arrives
    }
  }
);
```

## API Reference

### Health Check

```javascript
await apiClient.checkHealth()
```

Returns:
```json
{
  "status": "healthy",
  "apiKeys": { "openai": true, "anthropic": true, "google": true }
}
```

### OpenAI Methods

```javascript
// Chat completion
await apiClient.openaiChat(messages, options)

// Embeddings
await apiClient.openaiEmbeddings(input, options)

// List models
await apiClient.openaiModels()
```

### Anthropic Methods

```javascript
// Claude messages
await apiClient.anthropicMessages(messages, options)

// Streaming
await apiClient.anthropicMessagesStream(messages, onChunk, options)
```

### Google Methods

```javascript
// Generate content
await apiClient.googleGenerate(prompt, options)

// Chat with history
await apiClient.googleChat(messages, options)

// Embeddings
await apiClient.googleEmbeddings(content, options)
```

### Helper Methods

```javascript
// Simple chat (returns just text)
await apiClient.simpleChat(userMessage, provider, options)

// Simple embed (returns just vector)
await apiClient.embed(text, provider, options)
```

## Error Handling

```javascript
try {
  const response = await apiClient.simpleChat('Hello', 'openai');
  console.log(response);
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Server is down or slow');
  } else if (error.message.includes('not configured')) {
    console.error('API key missing in .env file');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Building Interactive Exercises

### Example: Chat Interface

```html
<input type="text" id="userInput" placeholder="Ask a question">
<button onclick="sendMessage()">Send</button>
<div id="output"></div>

<script src="../assets/js/api-client.js"></script>
<script>
const apiClient = new LLMAPIClient('http://localhost:3000');

async function sendMessage() {
  const input = document.getElementById('userInput').value;
  const output = document.getElementById('output');

  try {
    output.textContent = 'Thinking...';
    const response = await apiClient.simpleChat(input, 'openai');
    output.textContent = response;
  } catch (error) {
    output.textContent = 'Error: ' + error.message;
  }
}
</script>
```

### Example: Embedding Visualizer

```javascript
async function showEmbedding() {
  const text = document.getElementById('textInput').value;
  const embedding = await apiClient.embed(text, 'openai');

  // Display first 10 dimensions
  const preview = embedding.slice(0, 10).map(n => n.toFixed(4));
  console.log('Embedding:', preview);
  console.log('Full dimensions:', embedding.length);
}
```

## Common Patterns

### 1. Health Check on Load

```javascript
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const health = await apiClient.checkHealth();
    if (health.status !== 'healthy') {
      alert('Server is not healthy. Some API keys may be missing.');
    }
  } catch (error) {
    alert('Cannot connect to server. Make sure it is running on port 3000.');
  }
});
```

### 2. Loading States

```javascript
async function askQuestion() {
  const button = document.getElementById('askButton');
  const output = document.getElementById('output');

  button.disabled = true;
  output.textContent = 'Loading...';

  try {
    const response = await apiClient.simpleChat('What is RAG?', 'openai');
    output.textContent = response;
  } catch (error) {
    output.textContent = 'Error: ' + error.message;
  } finally {
    button.disabled = false;
  }
}
```

### 3. Provider Selection

```javascript
async function chatWithProvider(provider) {
  const providerName = {
    'openai': 'GPT-4',
    'anthropic': 'Claude',
    'google': 'Gemini'
  }[provider];

  console.log(`Using ${providerName}...`);
  const response = await apiClient.simpleChat('Hello!', provider);
  console.log(response);
}
```

## Troubleshooting

### Server Not Running

**Error:** `Request timeout - server may be down`

**Solution:**
```bash
cd server
npm run dev
```

### Missing API Keys

**Error:** `OPENAI_API_KEY not configured`

**Solution:** Add keys to `.env` file in repository root:
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

### CORS Errors

**Error:** `Access-Control-Allow-Origin`

**Solution:** Server already has CORS enabled. Ensure you're accessing via `localhost:3000` (not `127.0.0.1:3000`).

### Port Already in Use

**Error:** `EADDRINUSE`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

## Next Steps

1. ✅ Start backend server (`cd server && npm run dev`)
2. ✅ Test health endpoint (`/health`)
3. ✅ Try interactive demo (`tasks/task-4-api-demo.html`)
4. 🚀 Build your own RAG exercises using the API client

For more examples, see:
- `tasks/task-4-api-demo.html` - Complete interactive demo
- `assets/js/api-client.js` - Full API client source code
- `server/README.md` - Backend API documentation
