Type: research
Status: resolved
Blocked by: none

## Answer

Complete 12-table SQLite schema researched and written to `.scratch/duolingo-clone/research/01-database-schema.md`. Covers users, courses, units, skills, lessons, exercises (JSON `exercise_data`), user_progress, exercise_responses, xp_log, streaks, hearts, leaderboard. Key calls: JSON column for type-specific exercise config, dual-granularity progress tracking, time-based heart regen (1/30min, max 5), streak logic in app code. Maps to tickets [02] and [04].

## Question

Design the SQLite database schema for the Duolingo clone. Cover all entities needed: users, courses, units, skills, lessons, exercises, user progress (per skill, per lesson, per exercise), XP tracking, streak tracking, hearts, and exercise responses. Document the relationships, constraints, and indexes. Produce a complete CREATE TABLE script or migration file.
