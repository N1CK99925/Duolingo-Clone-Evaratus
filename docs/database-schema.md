# Database Schema

SQLite database (via SQLAlchemy ORM + Alembic migrations) at `backend/data/duolingo.db`.
Schema history: `58cbffa40e69` (initial) → `6a1f82b7c4d1` (exercises) → `1f3a2b4c5d6e`
(gamification) → `b2d4f6a8c0e1` (simplify: drop unused tables/columns).

## ER diagram

```text
courses 1───* units 1───* skills 1───* lessons 1───* exercises
                                       │
users 1───* user_progress *───1 lessons   (one row per completed lesson)
users 1───1 streaks
users 1───1 hearts
users 1───1 daily_goals
users 1───* achievements
users 1───* leaderboard_entries
```

## Tables

| Table | Columns | Purpose |
|---|---|---|
| `courses` | id, title, lang_source, lang_target | The seeded course (Hindi for English speakers). |
| `units` | id, course_id→courses, title, description, sort_order | Ordered units inside a course. |
| `skills` | id, unit_id→units, title, description, icon, sort_order | Ordered skill nodes inside a unit. |
| `lessons` | id, skill_id→skills, title, sort_order, xp_reward | Ordered lessons inside a skill; XP awarded on completion. |
| `exercises` | id, lesson_id→lessons, exercise_type, exercise_data (JSON), sort_order | Single table for all exercise types (`multiple_choice`, `fill_blank`, `word_match`); type-specific data lives in the JSON `exercise_data` column. |
| `users` | id, username (unique), created_at, total_xp, gems | Learners. `created_at` feeds the profile "Joined" date. |
| `user_progress` | id, user_id→users, skill_id→skills, lesson_id→lessons, is_completed | One row per completed lesson. `skill_id` is denormalized so progress queries need no lesson→skill join. |
| `streaks` | id, user_id→users (unique), current_streak, longest_streak, last_practice_date (YYYY-MM-DD) | Practice-day streak state. |
| `hearts` | id, user_id→users (unique), current_hearts, max_hearts | Heart/lives state. |
| `daily_goals` | id, user_id→users (unique), target_xp, xp_today, last_practice_date (YYYY-MM-DD) | Daily XP goal; `xp_today` resets when the date rolls over. |
| `achievements` | id, user_id→users, key, title, description, icon, goal, progress, unlocked_at, unique(user_id, key) | Per-user achievement progress; recomputed from earned state. |
| `leaderboard_entries` | id, user_id→users, weekly_xp, week_start (YYYY-MM-DD, Monday) | Weekly league standings (default learner + seeded rivals). |

## How things work

- **Progress** — completing a lesson inserts one `user_progress` row (`is_completed = 1`).
  Everything else is derived: a skill's completed-lesson count is a `COUNT(*)` of its rows,
  the path service marks skills `completed` when all lessons have rows, the next skill
  `active`, and the rest `locked`. There are no stored aggregate/lock/crown columns.
- **XP** — `lessons.xp_reward` is added to `users.total_xp` (and to the current week's
  `leaderboard_entries.weekly_xp`). No event log is kept.
- **Streaks** — `update_streak` compares today to `streaks.last_practice_date`: same day →
  no change, yesterday → +1, older → reset to 1. `longest_streak` is updated alongside.
- **Hearts** — wrong answers decrement `hearts.current_hearts` (unless `DUO_INFINITE_HEARTS`
  is set); 0 hearts blocks lesson completion. Hearts do not regenerate over time in this app.
- **Leaderboard** — `GET /api/leaderboard` reads `leaderboard_entries` for the current week
  (`week_start` = Monday) ordered by `weekly_xp`.
- **Derived values returned by the API** (not stored): path node `state`,
  `lessons_completed`/`lesson_count` per skill, `first_lesson_id`, skill completion,
  achievement progress, leaderboard ranks.

## Fields kept despite being theoretically derivable

- `users.created_at` — the profile page shows a "Joined <date>" line from it.
- `user_progress.skill_id` — denormalized to keep progress queries join-free.
- `user_progress.is_completed` — always 1 today, but kept as the explicit completion flag
  the queries filter on.
- `leaderboard_entries` table (vs. ranking on `users.total_xp`) — the feature is a
  *weekly* board with seeded rivals, which all-time XP cannot express.
- Surrogate `id` primary keys on the 1:1 tables (`streaks`, `hearts`, `daily_goals`) —
  kept to avoid churn; `user_id` is uniquely constrained.

## Removed in `b2d4f6a8c0e1` and why

- **`xp_log`, `exercise_responses` (tables)** — written on lesson completion / every answer
  but never read by any feature or UI.
- **`user_progress` aggregate rows + `crown_level`, `lessons_completed`, `last_practiced`,
  `created_at`, `updated_at`** — skill-level rows (`lesson_id IS NULL`) and these counters
  were written but never read; all such values are computed live.
- **`courses.is_active`, `courses.subtitle`** — one course exists; the filter and the
  subtitle are unused.
- **`units.is_locked`, `skills.is_locked`, `skills.skill_color`** — lock state is derived
  from progress; colors are hardcoded per unit in the frontend.
- **`lessons.is_hard`, `exercises.difficulty`** — exposed in API responses but no
  frontend component reads them.
- **`users.avatar_url`** — always NULL, never rendered.
- **All unused `created_at`/`updated_at`/`last_refill_at`** on `streaks`, `hearts`,
  `daily_goals`, `achievements`, `leaderboard_entries` — no feature reads them
  (there is no time-based heart regeneration).
