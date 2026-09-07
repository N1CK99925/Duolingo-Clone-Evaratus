## Destination

A Duolingo clone that matches the original's UI/UX and core lesson + gamification loops, built in clean vertical slices. Frontend Next.js (TS), backend FastAPI, SQLite. Each feature ships end-to-end (its own tables, API, UI, tests, lint) and is reviewed before the next begins. The docs/ folder holds the deliverables (architecture, schema, API).

## Notes

- **Architecture (NOT mushy)**: Backend = `app/` package layered `routers → services → db`, own `seed.py`, Pydantic schemas, pytest tests, ruff lint. Frontend = modular `components/` + `lib/` (API client), Nunito font, Tailwind 4. All features persist per user.
- **VERTICAL SLICES, one at a time**: 1 ticket = 1 feature, every slice ships its tables + API + UI + tests + lint, demoable alone. NEVER build the whole backend then the whole frontend.
- **Flow**: build ticket → report to Nick → he reviews → build next ticket. Only 1 ticket built per cycle.
- **Stack**: Next.js 16 (React 19, Tailwind 4, Bun) + FastAPI (Python 3.13, uv) + SQLite.
- **UI reference**: `.scratch/duolingo-clone/research/02-duolingo-ui-reference.md` + `docs/design-reference.md`. Assets in `public/assets/` with `ASSETS.md`/`USAGE.md`.
- **Auth**: none — hardcoded default learner.
- **Content — INDIAN LANGUAGES PRIMARY**: the seeded course(s) are Indian languages (e.g. Hindi for English speakers; optionally English-for-Hindi-speakers as a 2nd). Spanish is NOT the focus — it may be added as a later ticket, not the main course. Seed uses the actual target language for content; UI stays English.
- **Audio**: optional/placeholder. We only have es_* voices in assets today; Indian-language voices deferred (see `docs/hindi-audio-plan.md`). Do not block on audio.
- **Not over-engineering**: lean but clean; every table/endpoint exists because a feature needs it.

## Decisions so far

- [Database Schema Design](.scratch/duolingo-clone/issues/01-database-schema.md): research resource — 12-table schema, JSON `exercise_data` per type, dual-granularity progress, time-based heart regen, streak logic. Note: schema is language-agnostic (courses hold `lang_source`/`lang_target`); we seed Indian languages (Hindi primary), not Spanish.
- [Duolingo UI Reference](.scratch/duolingo-clone/issues/02-duolingo-ui-reference.md): research resource — full palette, chunky 3D buttons, node states, feedback bars, Nunito.
- **Planning approach**: re-charted from horizontal phases to vertical slices (see Out of scope for the horizontal tickets that were replaced).

## Not yet specified

- Deployment target/hosting (decide after build — Vercel + Render/Railway likely).

## Out of scope

- Horizontal whole-stack phases (architecture, gamification, exercise types, seed, README as standalone tickets) — closed and removed; redistributed into vertical slices 08–13 below, which each own their stack decisions per feature.

## Active tickets (vertical slices, do in order, 1 per cycle)

- [08 - VS1 Home Path & Shell](.scratch/duolingo-clone/issues/08-vs1-home-path.md): first user-visible feature — shell (top bar: streak/XP/hearts/gems) + skill tree path with locked/active/completed states. NOT blocked. Establishes stack wiring + architecture.
- [09 - VS2 Lesson Player Core](.scratch/duolingo-clone/issues/09-vs2-lesson-player.md): the core loop — run a lesson of multiple-choice exercises, progress bar, hearts loss, feedback bar, completion modal, XP award. Blocked by 08.
- [10 - VS3 Exercise Type Variety](.scratch/duolingo-clone/issues/10-vs3-exercise-types.md): word bank, match pairs, fill-in-blank, type-answer renderers + validation + seed. Blocked by 09.
- [11 - VS4 Gamification Depth](.scratch/duolingo-clone/issues/11-vs4-gamification.md): streak counter, daily/XP goal, seeded leaderboard, profile page + achievements. Blocked by 09.
- [12 - VS5 Hearts Lifecycle & Polish](.scratch/duolingo-clone/issues/12-vs5-hearts-polish.md): time-based heart regen, practice/refill, out-of-hearts modal, toasts, settings placeholders, celebratory polish. Blocked by 11.
- [13 - VS6 Full Course Seed + Docs](.scratch/duolingo-clone/issues/13-vs6-course-seed-docs.md): expand seed content, README + architecture/schema/API docs deliverables, responsive check. Blocked by 10, 11.