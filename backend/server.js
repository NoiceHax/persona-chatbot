import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
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
