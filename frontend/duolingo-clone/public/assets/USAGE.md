# Asset Usage Map — UI Guide

Where each asset is used in the app. Paths are relative to `src/assets/` (i.e. `/assets/...` served from `public/`).

## Header / Top Bar

| Asset | Path | Where used |
|-------|------|-----------|
| Logo | `/assets/mascot/duolingo-logo.svg` | Top-left brand mark |
| Streak flame | `/assets/icons/streak.svg` | Streak counter — orange `#FF9600` |
| XP bolt | `/assets/icons/xp.svg` | XP counter — green `#58CC02` |
| Hearts | `/assets/icons/heart.svg` | Hearts counter — red `#FF4B4B` |
| Gems | `/assets/icons/gem.svg` | Gems counter — purple `#CE82FF` |

## Learning Path / Skill Tree

| Asset | Path | Where used |
|-------|------|-----------|
| Skill node icon | emoji or **`/assets/icons/crown.svg`** | Completed node (gold `#FFC800`) |
| Locked node | CSS (gray circle + lock glyph) | Locked skills — `#E5E5E5` ring |
| Active node | green circle + emoji | Next skill — `#58CC02`, pulsing |
| Language flag | `/assets/flags/es.png` + `/assets/fr.png` + `/assets/it.png` + `/assets/jp.png` | Course selection / language toggle |

## Lesson Player

| Asset | Path | Where used |
|-------|------|-----------|
| Correct SFX | `/assets/correct.wav` | Correct answer feedback |
| Incorrect SFX | `/assets/incorrect.wav` | Wrong answer feedback |
| Finish fanfare | `/assets/finish.mp3` | Lesson complete modal |
| Correct check | `/assets/icons/check.svg` | Correct feedback bar (on green `#58CC02`) |
| Wrong X | `/assets/icons/x.svg` | Incorrect feedback bar (on red `#FF4B4B`) |
| Sound toggle | `/assets/icons/sound.svg` | Play TTS / toggle audio |
| Hear a word | `/assets/es_man.mp3` (or girl/woman/robot/zombie) | TTS replacement for pronunciation exercises |
| Character avatar | `/assets/boy.svg` `/assets/girl.svg` `/assets/man.svg` `/assets/woman.svg` | Sentence speaker avatar (the "speaker persona") |

## Mascot / Feedback states

| Asset | Path | When shown |
|-------|------|-----------|
| Happy Duo | `/assets/mascot/duo-happy.svg` | Correct answer, lesson complete |
| Sad Duo | `/assets/mascot/duo-sad.svg` | Wrong answer, lost a heart |
| Bad Duo | `/assets/mascot/duo-bad.svg` | Out of hearts / lesson failure |
| Hero illustration | `/assets/hero.svg` | Landing / welcome / empty states |

## Sidebar / Nav

| Asset | Path | Where used |
|-------|------|-----------|
| Learn | `/assets/learn.svg` | Learn/path tab |
| Leaderboard | `/assets/leaderboard.svg` | Leaderboard tab |
| Quests | `/assets/quests.svg` | Quests tab |
| Shop | `/assets/shop.svg` | Shop tab |
| Unlimited | `/assets/unlimited.svg` | Premium/Super promo |
| GitHub | `/assets/github.svg` | Footer attribution |

## Modals / Achievement states

| Asset | Path | Where used |
|-------|------|-----------|
| Finish | `/assets/finish.svg` | Lesson complete celebratory check |
| Points | `/assets/points.svg` | "+XP" reward chips |
| Crown | `/assets/icons/crown.svg` | Unit completion, leaderboard rank |
| Gem | `/assets/icons/gem.svg` | Shop/purchase, heart refill cost |

## Character speakers (TTS persona)

The repo ships 6 voice-clip personas (Spanish). Assign one per lesson/exercise prompt:

| Persona | Image | Audio |
|---------|-------|-------|
| Boy | `boy.svg` | `es_boy.mp3` |
| Girl | `girl.svg` | `es_girl.mp3` |
| Man | `man.svg` | `es_man.mp3` |
| Woman | `woman.svg` | `es_woman.mp3` |
| Robot | `robot.svg` | `es_robot.mp3` |
| Zombie | `zombie.svg` | `es_zombie.mp3` |

## Language flags

Course selection / "add course" / language switcher:
`flags/es.png` (Spanish) is the primary seeded course. `fr`, `it`, `jp`, `de`, `br`, `cn`, `kr`, `mx`, `us` available as bonus/switcher options. `flags/in.png` (Indian flag) for a Hindi (or English-from-Hindi) course option — matches the country elsewhere in the app.