# SignalProbe

An adaptive AI technical interview agent based on a candidate's actual
learning-progress data from a 31-day AI engineering cohort, then produces
structured feedback.

Built for ViCodathon (ABTalks Vibe Code Hackathon) — Problem Statement 2.

## How it works

1. On session start, the agent reads the candidate's mission history and picks
   the curriculum days most worth probing — weighted toward skipped topics,
   failed attempts, and high retry counts (`server/src/utils/topicSelector.js`).
2. Each turn, an LLM call (Groq) decides the next question, whether to go
   deeper on the current topic or move on, and whether the interview should
   wrap up — constrained to strict JSON via `server/src/utils/schemas.js`.
3. The interview enforces a minimum of 8 questions across at least 4 distinct
   curriculum days before it's allowed to end.
4. On completion, a second LLM call produces structured feedback
   (`summary`, `strengths`, `gaps`, `next`), grounded in the actual transcript.

## Stack

- Backend: Node/Express, Groq API (llama-3.3-70b-versatile)
- Frontend: React + Vite + Tailwind + Framer Motion
- Session state: in-memory (no DB — out of scope per brief)

## Running locally

```bash
cd server
npm install
cp .env.example .env   # add your GROQ_API_KEY
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## API

See `technical-spec.md` (provided) for the full contract. Single endpoint:
`POST /api/interview`.

## AI usage

See `PROMPTS.md` at repo root.
