# Scaler Mentors — Persona AI Chat

Chat with three AI-powered Scaler mentors, each with a unique teaching personality.

## Quick Start

```bash
# 1. Setup backend
cd backend
cp ../.env.example .env   # Add your GEMINI_API_KEY
npm install
npm run dev               # Starts on port 3001

# 2. Setup frontend (new terminal)
cd frontend
npm install
npm run dev               # Starts on port 5173
```

Open http://localhost:5173

## Personas

- **Anshuman Singh** — DSA fundamentals, structured teaching
- **Abhimanyu Saxena** — Career strategy, practical mentoring  
- **Kshitij Mishra** — Intuitive explanations, fun analogies

## Environment Variables

Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

Get your key at https://aistudio.google.com/app/apikey
