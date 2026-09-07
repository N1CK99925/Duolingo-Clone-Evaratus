Type: task
Status: open
Blocked by: 08

## Question

Build VS2 — the Lesson Player Core — the heart of the assignment. Run a lesson as a sequence of multiple-choice exercises with immediate feedback and the signature feedback bar.

SCOPE (end-to-end):
- backend/: `lessons`, `exercises`, `exercise_responses` tables; seed a few lessons of multiple-choice exercises; XP award on completion; hearts decrement on wrong answers.
- API: `GET /lessons/{id}` (lesson detail + ordered exercises), `POST /lessons/{id}/exercises/{exercise_id}/answer` (submit, returns correct/incorrect + feedback data + updated hearts), `POST /lessons/{id}/complete` (award XP, mark progress, update streak/hearts). Hearts set to 5 start, lose 1 per wrong answer; lesson fails at 0.
- Tests (pytest): answer correct → xp; answer wrong → hearts-1; complete lesson → skill marked, xp awarded; hearts 0 → lesson failure handled; idempotent/state transitions.
- Frontend: lesson player page — progress bar across top (green fill on #E5E5E5 track), hearts HUD, centered prompt, multiple-choice answer buttons, CHECK button, feedback bar (green #58CC02 + shadow for correct, red #FF4B4B for wrong), auto-advance, lesson-complete modal (+XP, mascot), out-of-hearts failure handling.
- Lint (ruff) + pytest clean; frontend `bun run build` + lint clean.

DELIVERABLE: start a lesson from the path, answer exercises, see the feedback bar + progress bar + hearts drain, hit completion modal and get XP. Report; Nick reviews before VS3.