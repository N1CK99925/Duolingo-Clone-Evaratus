Type: task
Status: open
Blocked by: 09

## Question

Build VS4 — Gamification Depth — streak, daily goal, leaderboard, and a profile page with achievements.

SCOPE (end-to-end):
- backend/: `streaks`, `xp_log`, `leaderboard` tables (leaderboard seeded with competitive learners); daily XP goal config; achievements computed from earned state.
- API: streak computation/increment on daily activity (simulate/testable: activity today/yesterday/broken); `GET /leaderboard` (this week, sorted, current learner's rank); `GET /profile` (stats: streak, total XP, achievements, daily goal progress); achievements derived from xp/streak/lessons milestones.
- Tests (pytest): streak increments on consecutive days, breaks on gap; leaderboard seeded + ranks + position; xp_log append; daily-goal progress; achievements awarded at thresholds.
- Frontend: top-bar streak counter wired to real streak; profile page (stats, achievements, goal ring); leaderboard page (seeded users, rank list). 
- Lint (ruff) + pytest clean; frontend build + lint clean.

DELIVERABLE: do a lesson today → streak counts, XP accumulates, profile + leaderboard pages render real state. Report; Nick reviews before VS5.