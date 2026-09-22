import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed browser origins. The frontend is served same-origin (persona.noicehax.dev
// proxies /api/* here), so this is really a guard against third-party pages calling
// the API from a visitor's browser. Override with ALLOWED_ORIGINS (comma-separated).
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://persona.noicehax.dev')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .concat(['http://localhost:5173', 'http://localhost:3000']);

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error('Not allowed by CORS')),
  }),
);
app.use(express.json());

// Chat API endpoint
app.post('/api/chat', chatHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
