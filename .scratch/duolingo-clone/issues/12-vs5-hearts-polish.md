Type: task
Status: open
Blocked by: 11

## Question

Build VS5 — Hearts Lifecycle & Polish — time-based heart regen, practice/refill, out-of-hearts modal, toasts, settings placeholders, and celebratory animation.

SCOPE (end-to-end):
- backend/: heart regen over time (regen 1 per 30 min on read, capped at 5/max); practice/refill endpoint (mock gems spend or practice lesson); out-of-hearts response when a lesson can't start.
- API: `GET /me/hearts` returns current + next-refill timestamp; `POST /me/hearts/refill` (mock gems); settings endpoints as placeholders (return 200 with fields, no logic).
- Tests (pytest): regen at time threshold, cap; refill decrements gems/increments hearts; all behavioral transitions.
- Frontend: hearts animate/decay with countdown in top bar; out-of-hearts modal (sad mascot, refill CTAs); practice-to-earn hearts; toasts for streak/achievement; settings placeholders ("Coming Soon"); celebratory animation (confetti/spring) on completion — mascot states (happy/sad/bad) wired to feedback.
- Lint + pytest + frontend build/lint clean.

DELIVERABLE: hearts regenerate over time, refill via mock gems, out-of-hearts flow blocks/refills, toasts + settings placeholders present, completion feels celebratory. Report; Nick reviews before VS6.