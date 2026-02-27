import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

// Initialize Anthropic client (lazily, only when API key exists)
let anthropicClient = null;
const getAnthropicClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
};

/**
 * POST /api/anthropic/messages
 * Proxy for Anthropic Messages API
 *
 * Request body:
 * {
 *   "model": "claude-3-5-sonnet-20241022",
 *   "messages": [{ "role": "user", "content": "Hello" }],
 *   "max_tokens": 1024,
 *   "temperature": 0.7,
 *   ...other Anthropic parameters
 * }
 */
router.post('/messages', async (req, res, next) => {
  try {
    const client = getAnthropicClient();
    const {
      model = 'claude-3-haiku-20240307',
      messages,
      max_tokens = 1024,
      ...options
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    const response = await client.messages.create({
      model,
      messages,
      max_tokens,
      ...options
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/anthropic/messages/stream
 * Streaming endpoint for Anthropic Messages API
 *
 * Request body: same as /messages
 * Response: Server-Sent Events (SSE) stream
 */
router.post('/messages/stream', async (req, res, next) => {
  try {
    const client = getAnthropicClient();
    const {
      model = 'claude-3-haiku-20240307',
      messages,
      max_tokens = 1024,
      ...options
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.messages.create({
      model,
      messages,
      max_tokens,
      stream: true,
      ...options
    });

    for await (const event of stream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
});

export default router;
