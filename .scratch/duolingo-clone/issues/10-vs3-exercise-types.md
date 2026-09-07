Type: task
Status: open
Blocked by: 09

## Question

Build VS3 — Exercise Type Variety — add the remaining exercise types to the lesson player.

SCOPE (end-to-end):
- Add `translate` (word bank: tap words to build a sentence), `match` (match pairs, two columns), `fill_in_blank` (tap/type the missing word), `type_answer` (free-text).
- backend/: exercise validation per type (case-insensitive where sensible, word-bank order check, match-pair correctness), seed content of all 5 types, extend answer-submit to validate each type correctly + return type-aware feedback.
- Tests (pytest): each type — correct and incorrect submissions validated right; word-bank order; match-pair partial; fill-in-blank; type-answer case handling.
- Frontend: renderers for each type sharing the same lesson-player shell (progress bar, feedback bar, hearts). Word-bank tap-to-add/tap-to-remove, match-pair selection interaction, blank + chips, free-text input. All use the established feedback + check flow.
- Lint (ruff) + pytest clean; frontend build + lint clean.

DELIVERABLE: one lesson containing varied exercise types plays through seamlessly with per-type validation and feedback. Report; Nick reviews before VS4.