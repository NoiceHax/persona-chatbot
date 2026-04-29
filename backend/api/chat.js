import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompts } from '../prompts.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

async function callWithRetry(systemPrompt, chatHistory, message, maxRetries = 2) {
  for (const modelName of MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        console.log(`✅ Response from ${modelName} (attempt ${attempt + 1})`);
        return reply;
      } catch (error) {
        const is429 = error.status === 429;
        const isLastAttempt = attempt === maxRetries;

        if (is429 && !isLastAttempt) {
          
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.log(`⏳ Rate limited on ${modelName}, retrying in ${Math.round(delay)}ms...`);
          await new Promise((r) => setTimeout(r, delay));
        } else if (is429) {
          
          console.log(` Quota exhausted for ${modelName}, trying next model...`);
          break;
        } else {
          throw error;
        }
      }
    }
  }

  // All models exhausted
  throw new Error('QUOTA_EXHAUSTED');
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
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

    // Build chat history for context
    const chatHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const reply = await callWithRetry(systemPrompt, chatHistory, message);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);

    if (error.message === 'QUOTA_EXHAUSTED' || error.status === 429) {
      return res.status(429).json({
        error: 'API quota exceeded. Please wait a few minutes and try again, or use a different API key.',
      });
    }

    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
