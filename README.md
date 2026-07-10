# SchemeSaathi
### Team: NULL POINTER EXCEPTIONS

AI-assisted government & private scheme finder for India. Enter a profile once,
get a ranked list of eligible schemes (grouped by category), see exactly what
documents/steps are needed, and check on behalf of friends/family too.

## Stack
- Frontend: React (Vite) + react-icons
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt

## Setup

### 1. Backend
```
cd backend
npm install
# Make sure MongoDB is running locally, OR set MONGO_URI in .env to an Atlas connection string
npm run seed      # loads sample government + private schemes
npm run dev       # starts server on http://localhost:5000
```

### 2. Frontend
```
cd frontend
npm install
npm run dev        # starts on http://localhost:5173, proxies /api to backend
```

Open http://localhost:5173

## How it works
1. Sign up / log in.
2. Set up your profile once (age, gender, income, occupation, disability, etc.) —
   supports "Not Sure" for income and disability, so users aren't blocked by
   missing information.
3. Get a ranked, categorized list of matching schemes — "confirmed" matches vs
   "possible" matches (where a Not Sure answer meant we can't fully confirm).
4. Click any scheme to see full documents required + step-by-step application
   process + direct apply link.
5. Add a friend/family member's profile separately to check their eligibility too,
   without mixing their data into your own account.

## Notes for the hackathon demo
- Seed data (`backend/data/seed.js`) includes ~10 real government + private
  schemes across farmer, disabled, widow, women, health, and student categories —
  enough to demonstrate the "15 schemes across multiple categories" scenario.
- Ranking is fully rule-based (see `backend/utils/ranking.js`) — no AI/LLM
  involved in eligibility or scoring, which keeps it explainable and safe from
  hallucination. An LLM call for natural-language explanations can be layered on
  top later without changing this core logic.
