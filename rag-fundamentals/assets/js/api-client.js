/**
 * Secure API Client for LLM Bootcamp
 *
 * Provides a clean interface to interact with LLM providers through
 * the secure Express backend (never exposes API keys to browser).
 */

class LLMAPIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL; // Empty string = same-origin requests
    this.defaultTimeout = 30000; // 30 seconds
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async _fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server may be down');
      }
      throw error;
    }
  }

  /**
   * Check server health and API key availability
   */
  async checkHealth() {
    return await this._fetch('/health');
  }

  // ==================== OpenAI Methods ====================

  /**
   * OpenAI Chat Completion
   * @param {Array} messages - Array of message objects { role, content }
   * @param {Object} options - Additional options (model, temperature, max_tokens, etc.)
   */
  async openaiChat(messages, options = {}) {
    return await this._fetch('/api/openai/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        model: options.model || 'gpt-4o-mini',
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens || 1000,
        ...options
      })
    });
  }

  /**
   * OpenAI Embeddings
   * @param {String|Array} input - Text or array of texts to embed
   * @param {Object} options - Additional options (model, etc.)
   */
  async openaiEmbeddings(input, options = {}) {
    return await this._fetch('/api/openai/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        input,
        model: options.model || 'text-embedding-3-small',
        ...options
      })
    });
  }

  /**
   * List available OpenAI models
   */
  async openaiModels() {
    return await this._fetch('/api/openai/models');
  }

  // ==================== Anthropic (Claude) Methods ====================

  /**
   * Anthropic Messages (Claude)
   * @param {Array} messages - Array of message objects { role, content }
   * @param {Object} options - Additional options (model, max_tokens, temperature, etc.)
   */
  async anthropicMessages(messages, options = {}) {
    return await this._fetch('/api/anthropic/messages', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        model: options.model || 'claude-3-haiku-20240307',
        max_tokens: options.max_tokens || 1024,
        temperature: options.temperature ?? 0.7,
        ...options
      })
    });
  }

  /**
   * Anthropic Streaming Messages (Server-Sent Events)
   * @param {Array} messages - Array of message objects { role, content }
   * @param {Function} onChunk - Callback for each chunk
   * @param {Object} options - Additional options
   */
  async anthropicMessagesStream(messages, onChunk, options = {}) {
    const url = `${this.baseURL}/api/anthropic/messages/stream`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: options.model || 'claude-3-haiku-20240307',
        max_tokens: options.max_tokens || 1024,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const event = JSON.parse(data);
            onChunk(event);
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  }

  // ==================== Google (Gemini) Methods ====================

  /**
   * Google Gemini Generate Content
   * @param {String} prompt - Text prompt
   * @param {Object} options - Additional options (model, generationConfig, etc.)
   */
  async googleGenerate(prompt, options = {}) {
    return await this._fetch('/api/google/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        model: options.model || 'gemini-pro',
        generationConfig: options.generationConfig,
        safetySettings: options.safetySettings,
        ...options
      })
    });
  }

  /**
   * Google Gemini Chat with History
   * @param {Array} messages - Array of message objects { role, content }
   * @param {Object} options - Additional options
   */
  async googleChat(messages, options = {}) {
    return await this._fetch('/api/google/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        model: options.model || 'gemini-pro',
        generationConfig: options.generationConfig,
        ...options
      })
    });
  }

  /**
   * Google Embeddings
   * @param {String} content - Text to embed
   * @param {Object} options - Additional options
   */
  async googleEmbeddings(content, options = {}) {
    return await this._fetch('/api/google/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        content,
        model: options.model || 'text-embedding-004',
        ...options
      })
    });
  }

  // ==================== Helper Methods ====================

  /**
   * Simple chat helper - sends a single user message and returns AI response
   * @param {String} userMessage - User's message
   * @param {String} provider - 'openai', 'anthropic', or 'google'
   * @param {Object} options - Additional options
   */
  async simpleChat(userMessage, provider = 'openai', options = {}) {
    const messages = [{ role: 'user', content: userMessage }];

    switch (provider) {
      case 'openai':
        const openaiResp = await this.openaiChat(messages, options);
        return openaiResp.choices[0].message.content;

      case 'anthropic':
        const anthropicResp = await this.anthropicMessages(messages, options);
        return anthropicResp.content[0].text;

      case 'google':
        const googleResp = await this.googleChat(messages, options);
        return googleResp.text;

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Extract text from embedding response
   * @param {String} text - Text to embed
   * @param {String} provider - 'openai' or 'google'
   */
  async embed(text, provider = 'openai', options = {}) {
    switch (provider) {
      case 'openai':
        const openaiResp = await this.openaiEmbeddings(text, options);
        return openaiResp.data[0].embedding;

      case 'google':
        const googleResp = await this.googleEmbeddings(text, options);
        return googleResp.embedding;

      default:
        throw new Error(`Unknown embedding provider: ${provider}`);
    }
  }
}

// Export for use in other scripts
window.LLMAPIClient = LLMAPIClient;
