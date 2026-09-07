# Duolingo Clone (Evaratus)

A functional Duolingo-style Hindi language-learning web app: a learning path on the
home page, an interactive five-exercise-type lesson loop, and the classic gamification
suite (XP, streak, hearts, leagues, quests, daily goal, chests, achievements).

Frontend and backend are separate apps. The frontend is statically exported and can be
hosted on any static host; the backend is a FastAPI JSON API backed by SQLite.

## Tech stack

| Layer    | Technology                                            |
|----------|-------------------------------------------------------|
| Frontend | Next.js 16 (App Router, static export), React 19, Tailwind v4, lottie-web |
| Backend  | Python 3, FastAPI, SQLAlchemy 2 (Mapped ORM), SQLite  |
| Tests    | Pytest (backend), Playwright (manual end-to-end checks) |

## Repository layout

```
backend/
  app/
    main.py            # FastAPI app: CORS setup, router wiring, seed-on-startup
    core/config.py     # Settings (env vars), API-only (frontend no longer served here)
    db.py              # SQLAlchemy engine/session
    models/            # course.py, user.py, gamification.py
    routers/           # core.py, gamification.py, lessons.py
    services/          # path, lesson_*, seed, gamification services
    app/data/          # exercise seed content (offline question banks)
    data/              # SQLite database (created & seeded on first run)
    tests/
  main.py              # uvicorn entrypoint (python main.py)
frontend/duolingo-clone/
  app/                 # Next.js page routes + App Router
  components/          # Lesson, LearningPath, gamification widgets
  hooks/  lib/  types/ # data fetching, type definitions
```

## Setup

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'      # or: uv sync
python main.py               # starts uvicorn on http://localhost:8000
pytest -q                    # run the test suite
```

On startup the DB is created and seeded automatically (course content, sample progress,
a demo user) if it does not already exist. The database file lives at
`backend/data/duolingo.db`; delete it to reset all progress, then restart the API.

### Frontend

```bash
cd frontend/duolingo-clone
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_BACKEND_URL
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable                  | App        | Default                      | Notes |
|---------------------------|------------|------------------------------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | Frontend   | `http://localhost:8000`      | Baked in at build time (static export) |
| `DUO_CORS_ORIGINS`        | Backend    | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated frontend origins allowed by CORS |
| `DUO_DATABASE_URL`        | Backend    | `sqlite:///data/duolingo.db`    | Optional override |

Because the frontend is statically exported, `NEXT_PUBLIC_BACKEND_URL` cannot be a
secret and any hosted frontend origin must be added to `DUO_CORS_ORIGINS`.

### Production build

```bash
cd frontend/duolingo-clone
npm run build          # exports a static site to out/
```

Host `out/` on any static server/CDN; run the backend API on a server that can reach
SQLite (or a real DB). Route the frontend origin through CORS as above.

## Architecture

- **Learning path** — `Course -> Unit (the "section" of the Duolingo path) -> Skill ->
  Lesson -> Exercise`. Skills are `locked` / `active` / `completed`; the path response
  offsets each unit into a snake-like column and shows chests, crowns, and path markers.
- **Lesson loop** — GET one lesson's exercises, submit each answer, POST complete to
  persist progress. Failure drops a heart; success awards XP. The loop supports five
  exercise types (see below).
- **Stateless API** — the backend stores nothing client-side; all state identity is via
  the demo user. Frontend fetches on mount and after mutations.

## Database schema

- `courses` (1) —–> `units` (per path section) —–> `skills` —–> `lessons` —–> `exercises`
- `users` (1) —–> `user_progress` (skill completion per user, with lesson_count / lessons_completed)
- Gamification: `streaks`, `hearts`, `daily_goals`, `achievements`, `chest_claims`, `leaderboard_entries`
  (each keyed by `user_id`, seeded for the demo user).

## API overview

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Readiness probe |
| `GET /api/me` | XP total, streak, hearts, daily goal progress |
| `GET /api/path` | Course tree with per-unit state (skills, chests, crowns) |
| `POST /api/path/chests/{unit_id}/claim` | Claim a completed unit's chest (XP + achievement) |
| `GET /api/lessons/{id}` | Exercise list for a lesson |
| `POST /api/lessons/{id}/exercises/{exercise_id}/answer` | Check an answer (correct/incorrect + correct answer) |
| `POST /api/lessons/{id}/complete` | Complete a lesson: XP, streak, progress, goals |
| `GET /api/leaderboard`, `/api/profile`, `/api/settings` | Gamification views |
| `GET /api/me/hearts`, `POST /api/me/hearts/refill` | Heart system |

### Exercise types

| Type          | Interaction                                      |
|---------------|--------------------------------------------------|
| `mc`          | Pick one of multiple choice options              |
| `fill_blank`  | Choose the word that fills a sentence gap        |
| `word_match`  | Match Hindi words to English translations        |
| `tap_words`   | Tap shuffled words from the sentence (Hindi reference) |
| `type_answer` | Type the English translation of a Hindi word     |

## Design notes & assumptions

- **Units are sections**: this build models the Duolingo path as units; there is no
  separate "section" table.
- Exercises are seeded statically (offline question banks) rather than generated on the
  fly, matching the "no ChatGPT on the server" constraint of the assignment.
- A single demo user is seeded (`duo@demo.local`) so the app is immediately testable.
- The experience is desktop-first; the static export means API URLs are build-time
  baked in (see env table).