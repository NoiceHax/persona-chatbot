import OpenAI from 'openai';
import { systemPrompts } from '../prompts.js';

// OpenAI-compatible endpoint. Points at NVIDIA NIM directly for local
// development, or at llm-gateway in deployment, which fronts a pool of NVIDIA
// keys and handles model selection and failover on our behalf.
const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.LLM_API_KEY || process.env.NVIDIA_API_KEY || '',
});

// Leaving this empty lets the gateway pick from this project's priority list,
// which is weighted towards latency because conversational feel matters more
// here than raw capability. Set LLM_MODEL to pin one.
const MODEL = process.env.LLM_MODEL || 'meta/llama-3.1-8b-instruct';

async function generateReply(systemPrompt, history, message) {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message },
    ],
    temperature: 0.8,
    max_tokens: 1024,
  });

  const reply = completion.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error('EMPTY_RESPONSE');
  }
  return reply;
}

// Origins allowed to call this handler from a browser. Kept in sync with the
// express CORS middleware in server.js; defaults to the deployed persona origin
// so the handler is safe even when run standalone (e.g. on a serverless host).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://persona.noicehax.dev')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .concat(['http://localhost:5173', 'http://localhost:3000']);

export default async function handler(req, res) {
  // CORS headers - reflect the request origin only when it's allow-listed,
  // rather than echoing "*" to every caller.
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, persona, history = [] } = req.body;

    if (!message || !persona) {
      return res.status(400).json({ error: 'Missing message or persona' });
    }

    const systemPrompt = systemPrompts[persona];
    if (!systemPrompt) {
      return res.status(400).json({ error: 'Invalid persona' });
    }

    // Keep the last 20 turns so long conversations do not grow the prompt
    // without bound.
    const chatHistory = history.slice(-20).map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const reply = await generateReply(systemPrompt, chatHistory, message);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('LLM error:', error?.status || '', error?.message || error);

    if (error?.status === 429) {
      return res.status(429).json({
        error: 'All models are rate limited right now. Please wait a moment and try again.',
      });
    }

    if (error?.status === 401 || error?.status === 403) {
      return res.status(500).json({ error: 'AI backend is not configured correctly.' });
    }

    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
