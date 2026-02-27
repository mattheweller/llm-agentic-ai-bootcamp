import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client (lazily, only when API key exists)
let openaiClient = null;
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

/**
 * POST /api/openai/chat
 * Proxy for OpenAI Chat Completions API
 *
 * Request body:
 * {
 *   "model": "gpt-4o-mini",
 *   "messages": [{ "role": "user", "content": "Hello" }],
 *   "temperature": 0.7,
 *   "max_tokens": 1000,
 *   ...other OpenAI chat completion parameters
 * }
 */
router.post('/chat', async (req, res, next) => {
  try {
    const client = getOpenAIClient();
    const { model = 'gpt-4o-mini', messages, ...options } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    const response = await client.chat.completions.create({
      model,
      messages,
      ...options
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/openai/embeddings
 * Proxy for OpenAI Embeddings API
 *
 * Request body:
 * {
 *   "model": "text-embedding-3-small",
 *   "input": "Text to embed"
 * }
 */
router.post('/embeddings', async (req, res, next) => {
  try {
    const client = getOpenAIClient();
    const { model = 'text-embedding-3-small', input, ...options } = req.body;

    if (!input) {
      return res.status(400).json({
        error: 'Invalid request: input text is required'
      });
    }

    const response = await client.embeddings.create({
      model,
      input,
      ...options
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/openai/models
 * List available OpenAI models
 */
router.get('/models', async (req, res, next) => {
  try {
    const client = getOpenAIClient();
    const response = await client.models.list();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
