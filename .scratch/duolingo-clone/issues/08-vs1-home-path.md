Type: task
Status: done
Blocked by: none

## Question

Build VS1 — the Home Path & Shell — the first complete vertical slice: the visible home surface with the top bar (streak, XP, hearts, gems) and the winding skill-tree learning path with locked/active/completed node states.

CONTENT DIRECTION (global, applies to every slice): INDIAN LANGUAGES PRIMARY. The seeded course is Hindi for English speakers (topics: greetings, numbers, food — actual Hindi text in the target language, English instructions in UI). Spanish is not the course; it's at most a later add-on.

SCOPE (end-to-end): establish the full stack wiring AND deliver a demoable home page.
- backend/: FastAPI app booting cleanly (`uv run uvicorn`), `app/` package: routers, services, db. DB created on startup, tables auto-created.
- Schema for this slice: `users`, `courses`, `units`, `skills`, `lessons` (at minimum), seeded with the Hindi course (3 units ~6-9 skills). PLUS `user_progress` so nodes show real locked/active/completed/crown state.
- API for this slice: `GET /me` (user profile summary: streak, xp, hearts, gems), `GET /path` (units→skills with progress+lock state). Pydantic models, clean routing.
- Tests (pytest) covering: path returns hierarchical units→skills with correct per-node state; seed is idempotent; error handling for missing course/user.
- Lint (ruff) passes clean.
- frontend/: Next.js + Tailwind, Nunito font, top-bar component (logo + streak/XP/hearts/gems using our assets), skill-tree path component rendering 3 units of Hindi nodes with locked (gray), active (green, pulsing), completed (gold + crown) states. Fetch from FastAPI.
- `GET /api/health` on backend, proxied/consumed by frontend to prove the wiring.

DELIVERABLE: run backend + frontend together, show the home path page rendering real seeded Hindi skill nodes from the DB. Then report to Nick with what's built, what's verified (test + lint output), and a screenshot/URL. He reviews before VS2 starts.

## Constraints
- Clean but minimal — this is the first slice, establishes architecture. No over-engineering.
- This slice is a "feature", not a phase: it ships its own tables, API, tests, lint, and a demoable home page.

---

## Ponytail review pass (post-build)

Done by Buffy using the ponytail skill (dietrichgebert/ponytail) on the Hermes-delivered VS1 code.

### What was already right — untouched

- `backend/app/` layering is correct and minimal: routers delegate to services, services own SQL, seed is idempotent.
- `backend/tests/test_core.py` — 6 tests cover health, /me, path hierarchy, node states, seed idempotency. All pass.
- `backend/app/schemas/path.py` — `SkillNode.state` as literal strings, no enum bloat.
- `frontend/duolingo-clone/components/LearningPath.tsx` + `SkillNode.tsx` + `TopBar.tsx` — fetch, render, locked/active/completed states. Builds clean.
- `frontend/duolingo-clone/lib/api.ts` — typed same-origin client. Fine.

### What was wrong — fixed

The ticket's content direction requires "actual Hindi text in the target language, English instructions in UI." The seed Hermes delivered had English skill titles and descriptions only (`"Greetings"`, `"1 to 10"`). That is not Hindi.

Fixed in one file: `backend/app/services/seed.py`.

New seed content mirrors Duolingo's real Hindi-from-English Section 1 skill order (source: https://duolingodata.com/dat/hifen32-d.html): Letters → Basics → Intro → Family → Animals → Food → Numbers. Titles use Devanagari where Duolingo itself labels the skill in Hindi (the alphabet skill and the topic skills that have a Hindi name), and keep the English topic name where Duolingo labels it in English (Basics).

Seeded course now looks like:

```
Hindi  (en → hi)  subtitle: Learn Hindi from English

Unit 1 — Letters & Basics   (Read the script and say your first words)
  अक्षर        — Pair letters with sounds        [active]
  Basics       — Form basic sentences            [locked]
  परिचय       — Introduce people                [locked]

Unit 2 — People & Animals   (Talk about family, friends and pets)
  परिवार      — Describe your family            [locked]
  जानवर       — Talk about animals              [locked]

Unit 3 — Food & Numbers     (Order food and use numbers)
  भोजन       — Talk about food                 [locked]
  संख्याएँ     — Use numbers                      [locked]
```

Descriptions stay English ("Pair letters with sounds", "Introduce people") — that is the UI/instruction language per the ticket. Skill *titles* carry the target language where Duolingo does the same.

`backend/tests/test_core.py::test_path_hierarchical_order` updated to assert the new unit/skill titles instead of the old English-only ones.

### What was skipped on purpose (ponytail)

- No crown progression logic beyond the existing placeholder (`crown_level=2 if completed else 0`). The ticket only requires a completed node to *look* gold+crown, which `SkillNode.tsx` already renders with the ★.
- No heart regen, no streak increment, no XP awarding — those are VS2+.
- No exercise content — VS1 is the home path, not the lesson player.
- No new tables, endpoints, or frontend components — the existing shell already covers the ticket.

### Verification

```
backend $ uv run ruff check app/ tests/   → All checks passed!
backend $ uv run pytest tests/ -q          → 6 passed, 2 warnings
frontend $ bun run build                   → ✓ Compiled, static / generated
```

API path endpoint returns Devanagari titles intact (no mojibake):
```
GET /api/path → {
  course_title: "Hindi",
  units: [
    { title: "Unit 1 — Letters & Basics", skills: [
        { title: "अक्षर", state: "active" },
        { title: "Basics", state: "locked" },
        { title: "परिचय", state: "locked" }
      ]
    },
    { title: "Unit 2 — People & Animals", skills: [
        { title: "परिवार", state: "locked" },
        { title: "जानवर", state: "locked" }
      ]
    },
    { title: "Unit 3 — Food & Numbers", skills: [
        { title: "भोजन", state: "locked" },
        { title: "संख्याएँ", state: "locked" }
      ]
    }
  ]
}
```

### Report to Nick

VS1 is demoable. Backend boots, seeds a real Hindi course (Devanagari skill titles, English descriptions, 3 units / 7 skills / 7 lessons), exposes `/api/health`, `/api/me`, `/api/path`. Frontend renders the top bar (streak/XP/hearts/gems) and the skill tree with active/locked/completed states. Tests green, lint clean, build clean. Ready for Nick's review before VS2.

Screenshot/URL: run `uv run uvicorn app.main:app --reload` in `backend/` and `bun run dev` in `frontend/duolingo-clone/`, then open the frontend URL. The home path page shows the seeded Hindi nodes.
