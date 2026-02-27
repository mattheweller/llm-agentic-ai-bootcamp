import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Initialize Google Generative AI client (lazily, only when API key exists)
let googleClient = null;
const getGoogleClient = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY not configured');
  }
  if (!googleClient) {
    googleClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return googleClient;
};

/**
 * POST /api/google/generate
 * Proxy for Google Gemini API
 *
 * Request body:
 * {
 *   "model": "gemini-1.5-flash",
 *   "prompt": "Hello, how are you?",
 *   "generationConfig": {
 *     "temperature": 0.7,
 *     "maxOutputTokens": 1024,
 *     "topP": 0.9,
 *     "topK": 40
 *   }
 * }
 */
router.post('/generate', async (req, res, next) => {
  try {
    const client = getGoogleClient();
    const {
      model = 'gemini-1.5-flash',
      prompt,
      generationConfig,
      safetySettings
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Invalid request: prompt is required'
      });
    }

    const genModel = client.getGenerativeModel({ model });
    const result = await genModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings
    });

    const response = result.response;
    res.json({
      text: response.text(),
      candidates: response.candidates,
      promptFeedback: response.promptFeedback
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/google/chat
 * Chat endpoint for Google Gemini API with conversation history
 *
 * Request body:
 * {
 *   "model": "gemini-1.5-flash",
 *   "messages": [
 *     { "role": "user", "content": "Hello" },
 *     { "role": "model", "content": "Hi there!" },
 *     { "role": "user", "content": "How are you?" }
 *   ],
 *   "generationConfig": { ... }
 * }
 */
router.post('/chat', async (req, res, next) => {
  try {
    const client = getGoogleClient();
    const {
      model = 'gemini-1.5-flash',
      messages,
      generationConfig,
      safetySettings
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1];

    const genModel = client.getGenerativeModel({ model });
    const chat = genModel.startChat({
      history,
      generationConfig,
      safetySettings
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    res.json({
      text: response.text(),
      candidates: response.candidates,
      promptFeedback: response.promptFeedback
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/google/embeddings
 * Proxy for Google Embeddings API
 *
 * Request body:
 * {
 *   "model": "text-embedding-004",
 *   "content": "Text to embed"
 * }
 */
router.post('/embeddings', async (req, res, next) => {
  try {
    const client = getGoogleClient();
    const { model = 'text-embedding-004', content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Invalid request: content is required'
      });
    }

    const genModel = client.getGenerativeModel({ model });
    const result = await genModel.embedContent(content);

    res.json({
      embedding: result.embedding.values
    });
  } catch (error) {
    next(error);
  }
});

export default router;
