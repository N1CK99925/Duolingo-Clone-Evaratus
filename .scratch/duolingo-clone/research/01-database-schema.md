# Database Schema — Duolingo Clone

> SQLite schema for a solo-learner Duolingo clone. One default user, one seeded language course (Spanish), gamification via XP / streak / hearts / leaderboard.

---

## Overview / ER Summary

```
courses ──< units ──< skills ──< lessons ──< exercises
                                                  │
                                          exercise_responses
                                                  │
users ──────────────── user_progress ─────────────┘
users ──────────────── xp_log
users ──────────────── streak_log
users ──────────────── hearts
users ──────────────── leaderboard (view)
```

---

## Tables

### 1. `users`

Minimal profile — no password, no OAuth. The app seeds one default learner on first run.

```sql
CREATE TABLE users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT    NOT NULL UNIQUE,          -- display name, e.g. "Learner"
    avatar_url  TEXT,                             -- optional path to avatar image
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

**Indexes:** None needed beyond the implicit PK and UNIQUE on `username`.

---

### 2. `courses`

Top-level container. Seeded with one course (e.g. "Spanish for English Speakers").

```sql
CREATE TABLE courses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,                 -- e.g. "Spanish"
    subtitle    TEXT,                             -- e.g. "Basics 1"
    lang_source TEXT    NOT NULL,                 -- source language code, e.g. "en"
    lang_target TEXT    NOT NULL,                 -- target language code, e.g. "es"
    is_active   INTEGER NOT NULL DEFAULT 1        -- toggle course visibility
);
```

---

### 3. `units`

A course is divided into thematic units (like Duolingo's "Sections").

```sql
CREATE TABLE units (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,                 -- e.g. "Unit 1: Greetings & Basics"
    description TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,       -- display order within course
    is_locked   INTEGER NOT NULL DEFAULT 0        -- unlock gate (all 0 for seed data)
);

CREATE INDEX idx_units_course ON units(course_id);
```

---

### 4. `skills`

Skills live inside units. Each skill represents a focused topic (e.g. "Food", "Animals"). In Duolingo this is the "skill crown" / node on the tree.

```sql
CREATE TABLE skills (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id     INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,                 -- e.g. "Greetings"
    description TEXT,                             -- short blurb shown in UI
    icon        TEXT,                             -- icon name or path
    sort_order  INTEGER NOT NULL DEFAULT 0,
    skill_color TEXT    DEFAULT '#58cc02',         -- Duolingo-style color per skill
    is_locked   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_skills_unit ON skills(unit_id);
```

---

### 5. `lessons`

Each skill has multiple lessons (progressive difficulty). Completing all lessons in a skill unlocks the next skill (or raises its crown level).

```sql
CREATE TABLE lessons (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id    INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,                 -- e.g. "Lesson 1 of Greetings"
    sort_order  INTEGER NOT NULL DEFAULT 0,
    xp_reward   INTEGER NOT NULL DEFAULT 10,      -- XP earned for completion
    is_hard     INTEGER NOT NULL DEFAULT 0        -- "hard exercise" variant flag
);

CREATE INDEX idx_lessons_skill ON lessons(skill_id);
```

---

### 6. `exercises`

The core question bank. Each exercise belongs to exactly one lesson. The `exercise_data` JSON column holds all exercise-type-specific configuration.

```sql
CREATE TABLE exercises (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id     INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    exercise_type TEXT    NOT NULL,               -- enum: see below
    exercise_data TEXT    NOT NULL DEFAULT '{}',  -- JSON blob (schema per type)
    sort_order    INTEGER NOT NULL DEFAULT 0,
    difficulty    INTEGER NOT NULL DEFAULT 1      -- 1=easy, 2=medium, 3=hard
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
```

#### `exercise_type` values and their `exercise_data` JSON schemas
MAKE THIS HINDI 
| Type | Description | JSON Shape |
|---|---|---|
| `multiple_choice` | Pick the correct answer from N choices | `{"prompt": "How do you say 'hello'?", "choices": ["Hola", "Adiós", "Gracias", "Por favor"], "correct_index": 0}` |
| `translate_word_bank` | Arrange words from a bank to form a sentence | `{"prompt": "Translate: The cat drinks water", "word_bank": ["El", "gato", "bebe", "agua", "Los"], "correct_order": ["El", "gato", "bebe", "agua"]}` |
| `match_pairs` | Match items from two columns | `{"pairs": [{"left": "Gato", "right": "Cat"}, {"left": "Perro", "right": "Dog"}, {"left": "Casa", "right": "House"}]}` |
| `fill_in_blank` | Type the missing word | `{"prompt": "Me ___ Juan", "blank_index": 1, "correct_answers": ["llamo", "llamo"], "hint": "to be called"}` |
| `type_the_answer` | Free-text type the translation | `{"prompt": "Type 'thank you' in Spanish", "correct_answers": ["gracias"], "case_sensitive": false}` |

> **Design note:** Keeping exercise config in a single JSON column avoids an EAV pattern or a dozen type-specific tables. The backend validates the JSON shape against the `exercise_type` on seed/write. This is the right trade-off for a single-course app.

---

### 7. `user_progress`

Tracks the learner's state per skill **and** per lesson. This dual granularity lets the UI show both the skill tree position and per-lesson completion.

```sql
CREATE TABLE user_progress (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id        INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    lesson_id       INTEGER REFERENCES lessons(id) ON DELETE SET NULL,  -- NULL = skill-level row only
    crown_level     INTEGER NOT NULL DEFAULT 0,   -- 0–5, like Duolingo crowns
    lessons_completed INTEGER NOT NULL DEFAULT 0,  -- count toward crown level
    is_completed    INTEGER NOT NULL DEFAULT 0,   -- all lessons in skill done
    last_practiced  TEXT,                          -- datetime of most recent practice
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),

    UNIQUE(user_id, skill_id, lesson_id)          -- one row per user×skill×lesson
);

CREATE INDEX idx_progress_user    ON user_progress(user_id);
CREATE INDEX idx_progress_skill   ON user_progress(skill_id);
CREATE INDEX idx_progress_lesson  ON user_progress(lesson_id);
```

> A skill-level row (lesson_id=NULL) holds the aggregate crown level. Lesson-level rows track individual lesson completion. The API layer reconciles both on write.

---

### 8. `exercise_responses`

Every answer the learner submits. Enables review, analytics, and "wrong answer" practice.

```sql
CREATE TABLE exercise_responses (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id   INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    lesson_id     INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,  -- denormalized for fast queries
    is_correct    INTEGER NOT NULL,                -- 1=correct, 0=wrong
    user_answer   TEXT,                            -- the learner's submitted answer (text or JSON array for word-bank order)
    time_spent_ms INTEGER,                         -- time from exercise display to submission
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_responses_user     ON exercise_responses(user_id);
CREATE INDEX idx_responses_exercise ON exercise_responses(exercise_id);
CREATE INDEX idx_responses_lesson   ON exercise_responses(lesson_id);
CREATE INDEX idx_responses_correct  ON exercise_responses(is_correct);
```

---

### 9. `xp_log`

Immutable append-only log of every XP event. The current total is derived by summing, or cached on the user record.

```sql
CREATE TABLE xp_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount      INTEGER NOT NULL,                 -- XP gained (always positive)
    source      TEXT    NOT NULL,                  -- 'lesson_complete', 'practice', 'streak_bonus', 'perfect_lesson', 'review'
    ref_id      INTEGER,                          -- FK to lesson_id, exercise_id, etc. (polymorphic — no FK constraint)
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_xp_user ON xp_log(user_id);
```

> Derived field suggestion: store `total_xp` on `users` as a denormalized counter, updated by the API on each XP event. Avoids summing the log on every request.

---

### 10. `streaks`

One row per user. Updated at end of each lesson when the learner practiced today.

```sql
CREATE TABLE streaks (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,    -- consecutive days
    longest_streak INTEGER NOT NULL DEFAULT 0,    -- all-time best
    last_practice_date TEXT,                       -- YYYY-MM-DD of most recent practice day
    created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

**Streak logic (handled in application code, not the DB):**

1. On lesson completion, compare `last_practice_date` to today.
2. Same day → no change.
3. Yesterday → `current_streak += 1`.
4. Older → `current_streak = 1` (streak broken).
5. Always update `longest_streak = max(longest_streak, current_streak)`.

---

### 11. `hearts`

Lives system. Learners lose hearts on wrong answers; hearts regenerate over time (or can be topped up).

```sql
CREATE TABLE hearts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_hearts  INTEGER NOT NULL DEFAULT 5,   -- 0–5
    max_hearts      INTEGER NOT NULL DEFAULT 5,
    last_refill_at  TEXT,                          -- datetime of last heart regen check
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

> Heart regen logic (app code): on each API request, calculate elapsed time since `last_refill_at`. Regenerate 1 heart per 30 minutes (configurable), up to `max_hearts`. Update `current_hearts` and `last_refill_at` atomically.

---

### 12. `leaderboard`

For a solo-learner app this is mostly a vanity feature, but it lets you show a "weekly league" UI. A leaderboard is a snapshot that groups users by XP earned in the current week.

```sql
CREATE TABLE leaderboard (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    league          TEXT    NOT NULL DEFAULT 'bronze',  -- bronze, silver, gold, diamond
    week_start      TEXT    NOT NULL,                   -- YYYY-MM-DD of the Monday this row covers
    xp_earned       INTEGER NOT NULL DEFAULT 0,        -- XP earned within that week
    rank_in_league  INTEGER,                            -- computed on snapshot, or set by a weekly job
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),

    UNIQUE(user_id, week_start)                        -- one row per user per week
);

CREATE INDEX idx_leaderboard_week   ON leaderboard(week_start);
CREATE INDEX idx_leaderboard_xp     ON leaderboard(xp_earned);
CREATE INDEX idx_leaderboard_league ON leaderboard(league);
```

> For a solo app, `leaderboard` can just be the one default user's history. If you ever add mock competitors (bots), insert additional rows here.

---

## Seed Data Assumptions

The seeder will populate:

| Table | Seed Count | Notes |
|---|---|---|
| `users` | 1 | `{username: "Learner"}` |
| `courses` | 1 | Spanish for English speakers |
| `units` | 3 | Basics, Food & Drink, Travel |
| `skills` | ~6–9 | 2–3 per unit |
| `lessons` | ~2–4 per skill | ~15–30 total |
| `exercises` | ~5–10 per lesson | ~100–200 total |
| `streaks` | 1 | Default user, streak=0 |
| `hearts` | 1 | Default user, 5 hearts |
| `xp_log` | 0 | Empty on first run |
| `leaderboard` | 0 | Populated dynamically |

---

## Full-Text Search (Optional)

If you want to search exercises by prompt text, SQLite FTS5 is available:

```sql
CREATE VIRTUAL TABLE exercises_fts USING fts5(
    exercise_type,
    exercise_data,      -- searches inside the JSON text
    content='exercises',
    content_rowid='id'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER exercises_ai AFTER INSERT ON exercises BEGIN
    INSERT INTO exercises_fts(rowid, exercise_type, exercise_data)
    VALUES (new.id, new.exercise_type, new.exercise_data);
END;
```

> Only add this if you actually need search. Skip it for the MVP.

---

## Design Decisions

1. **JSON for `exercise_data`** — avoids a proliferation of type-specific tables. The trade-off is no referential integrity on the JSON contents, but SQLite's `json_extract()` makes querying possible, and the FastAPI layer validates shape on write.

2. **`user_progress` has both `skill_id` and `lesson_id`** — skill-level rows (lesson_id=NULL) track aggregate crown level; lesson-level rows track per-lesson completion. Two granularity levels in one table is simpler than two tables.

3. **`exercise_responses.lesson_id` is denormalized** — saves a JOIN on every response write and most read queries (lessons completed, accuracy stats per lesson).

4. **Hearts are time-based, not lives-per-session** — no "hearts refill on restart" mechanic; they tick down in real time. Simpler to implement and feels more authentic.

5. **Leaderboard uses weekly snapshots** — `week_start` anchors each row to a Mon–Sun period. A background task (or lazy check on API call) computes ranks when the week changes.

6. **No separate `achievements` / `badges` table** — out of scope for MVP. Can be added later as a simple `user_achievements` table without schema migration headaches.

7. **All timestamps are ISO 8601 TEXT** — SQLite has no native datetime type; `datetime('now')` returns UTC strings, which the app converts to local time for display.
