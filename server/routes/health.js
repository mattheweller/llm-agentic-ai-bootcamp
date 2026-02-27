import { Router } from 'express';

const router = Router();

/**
 * Health check endpoint
 * Verifies that required API keys are loaded (without exposing their values)
 */
router.get('/', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiKeys: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      google: !!process.env.GOOGLE_API_KEY
    }
  };

  // Determine overall status
  const allKeysPresent = Object.values(health.apiKeys).every(Boolean);
  if (!allKeysPresent) {
    health.status = 'degraded';
    health.warnings = [];

    if (!health.apiKeys.openai) health.warnings.push('OPENAI_API_KEY not configured');
    if (!health.apiKeys.anthropic) health.warnings.push('ANTHROPIC_API_KEY not configured');
    if (!health.apiKeys.google) health.warnings.push('GOOGLE_API_KEY not configured');
  }

  const statusCode = allKeysPresent ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
