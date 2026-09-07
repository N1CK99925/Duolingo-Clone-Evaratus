# Assets Manifest — Duolingo Clone

All visual and audio assets for the Duolingo clone web app.

## mascot/ — Duo owl characters + logo

| File | Description | Source |
|------|-------------|--------|
| `duo-happy.svg` | Duo owl happy expression (80x80) | code-with-antonio/nextjs-duolingo-clone (open-source recreation) |
| `duo-sad.svg` | Duo owl sad expression (80x80) | same |
| `duo-bad.svg` | Duo owl wrong/incorrect expression (80x80) | same |
| `duolingo-logo.svg` | "Duo" wordmark (179x42), decompressed from gzip | official CDN d35aaqx5ub95lt.cloudfront.net |

> Note: Duolingo's official character PNGs return HTTP 403 to non-browser clients. We use open-source SVG recreations. Replace before commercial deployment if licensing matters.

## icons/ — Top-bar & UI icons (Lucide, MIT)

| File | Description |
|------|-------------|
| `streak.svg` | Flame — streak counter |
| `xp.svg` | Zap/lightning — XP counter |
| `heart.svg` | Heart — remaining lives |
| `gem.svg` | Gem/diamond — premium currency |
| `crown.svg` | Crown — skill/unit completion |
| `sound.svg` | Speaker — audio toggle |
| `check.svg` | Checkmark — correct/success |
| `x.svg` | Cross — incorrect/close |

## flags/ — Course language flags (flagcdn.com, PNG)

`us` `es` `fr` `de` `it` `jp` `kr` `cn` `br` `mx` `in` (Indian, 160x107 — 2:3 ratio)

## Top-level — SVG UI assets (from sanidhyy/duolingo-clone)

| File | Description |
|------|-------------|
| `es.svg` `fr.svg` `hr.svg` `it.svg` `jp.svg` | Language flags (Spanish, French, Croatian, Italian, Japanese) |
| `heart.svg` | Heart (duplicate of icons/heart.svg — prefer icons/) |
| `points.svg` | Lightning bolt / XP |
| `leaderboard.svg` | Leaderboard trophy icon |
| `learn.svg` | Learn/book icon |
| `finish.svg` | Checkmark / completion |
| `quests.svg` | Quests scroll icon |
| `shop.svg` | Shop icon |
| `unlimited.svg` | Premium/unlimited icon |
| `github.svg` | GitHub logo |
| `hero.svg` | Hero illustration (791x779) |
| `boy.svg` `girl.svg` `man.svg` `woman.svg` `robot.svg` `zombie.svg` | Learner character illustrations (192xN) |
| `mascot.svg` `mascot_sad.svg` `mascot_bad.svg` | Duo owl (duplicates of mascot/duo-happy, duo-sad, duo-bad — prefer mascot/) |

## fonts/ — Duolingo signature typeface (from jokerhutt/ludolang)

| File | Description |
|------|-------------|
| `DIN Next Rounded LT W04 Bold.woff` | Duolingo-style bold heading font |
| `DIN Next Rounded LT W04 Light.woff` | Duolingo-style light body font |

## lottie/ — Animated JSON illustrations (from jokerhutt/ludolang)

| File | Description |
|------|-------------|
| `LC_TROPHY.json` | Trophy celebration — lesson completion |
| `STR_INCREASE.json` | Streak flame increase animation |

## icons/ (extended) — Additional UI icons (from jokerhutt/ludolang)

| File | Description |
|------|-------------|
| `GEM_ICON.svg` | Gem/premium currency (colored variant) |
| `LEADERBOARD_ICON.png` | League leaderboard icon |
| `ONEHUNDRED_ICON.svg` | 100% accuracy badge |
| `QUEST_ACCURACY.svg` | Quest: accuracy challenge |
| `QUEST_PERFECT.svg` | Quest: perfect lesson |
| `QUEST_STREAK.svg` | Quest: streak challenge |
| `STAR_COMPLETE.svg` | Completed unit star |
| `STAR_INCOMPLETE.svg` | Incomplete unit star |
| `STREAK_FLAME_ICON.png` | Streak flame (raster, colored) |
| `TARGET_ICON.svg` | Target/accuracy icon |

## Audio (from sanidhyy/duolingo-clone)

| File | Description |
|------|-------------|
| `correct.wav` | Correct answer sound |
| `incorrect.wav` | Wrong answer sound |
| `finish.mp3` | Lesson-complete fanfare |
| `es_boy.mp3` `es_girl.mp3` `es_man.mp3` `es_woman.mp3` `es_robot.mp3` `es_zombie.mp3` | Spanish pronunciation voices (VOS) |

## Audio (extended) — from jokerhutt/ludolang

| File | Description |
|------|-------------|
| `audio/completeLesson.mp3` | Lesson-complete sound (alternate) |
| `audio/completeLessonExtra.mp3` | Lesson-complete extra fanfare |