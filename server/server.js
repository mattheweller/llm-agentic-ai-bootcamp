import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import route handlers
import healthRouter from './routes/health.js';
import openaiRouter from './routes/openai.js';
import anthropicRouter from './routes/anthropic.js';
import googleRouter from './routes/google.js';

// Load environment variables from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.use('/health', healthRouter);

// API routes for LLM providers
app.use('/api/openai', openaiRouter);
app.use('/api/anthropic', anthropicRouter);
app.use('/api/google', googleRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LLM Bootcamp API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      openai: '/api/openai',
      anthropic: '/api/anthropic',
      google: '/api/google'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 LLM Bootcamp API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
