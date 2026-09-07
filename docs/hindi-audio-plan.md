# Hindi Audio Plan
DO NOT IMPLEMENT THIS YET, THIS IS SAVED FOR LATER.
Spanish has `es_boy.mp3`, `es_girl.mp3` etc. in `public/assets/`. Hindi needs the same treatment — same filenames, same structure, different prefix.

## How to generate (run once, commit the mp3s)

### Required packages

```bash
pip install edge-tts
```

No API key needed. edge-tts uses free Microsoft Edge voice infrastructure.

### Available Hindi voices

| Voice ID | Gender | Style |
|----------|--------|-------|
| `hi-IN-SwaraNeural` | Female | Clear, natural — use for girl/woman |
| `hi-IN-MadhurNeural` | Male | Warm, natural — use for boy/man |

Only 2 voices available (vs 6 for Spanish). Duplicate 1 voice for the other 2 slots:
```
hi_boy.mp3    <- MadhurNeural (boy + man same voice)
hi_girl.mp3   <- SwaraNeural (girl + woman same voice)
hi_woman.mp3  <- SwaraNeural (same)
hi_man.mp3    <- MadhurNeural (same)
hi_robot.mp3  <- MadhurNeural (add "robot" filter if available, else same)
hi_zombie.mp3 <- MadhurNeural (same)
```

### Generate files

Run from repo root:

```bash
cd frontend/duolingo-clone/public/assets

# Greetings
edge-tts --voice hi-IN-MadhurNeural --text "नमस्ते" --write-media hi_boy.mp3
edge-tts --voice hi-IN-SwaraNeural --text "नमस्ते" --write-media hi_girl.mp3

# Goodbye
edge-tts --voice hi-IN-MadhurNeural --text "अलविदा" --write-media hi_man.mp3
edge-tts --voice hi-IN-SwaraNeural --text "शुभ प्रभात" --write-media hi_woman.mp3

# All-purpose lesson opener
edge-tts --voice hi-IN-MadhurNeural --text "चलो सीखते हैं" --write-media hi_robot.mp3
edge-tts --voice hi-IN-SwaraNeural --text "बहुत अच्छा!" --write-media hi_zombie.mp3
```

Replace the `--text` values with actual Hindi exercise phrases once the seed content is decided. The convention: each `hi_*.mp3` is the TTS pronunciation of the Spanish exercise translated into Hindi.

### Or: programmatic batch generation

```python
# generate_hindi_audio.py (run once, committed output is the mp3s)
import subprocess
import shutil

VOICES = {
    "boy":  "hi-IN-MadhurNeural",
    "girl": "hi-IN-SwaraNeural",
    "man":  "hi-IN-MadhurNeural",
    "woman":"hi-IN-SwaraNeural",
    "robot":"hi-IN-MadhurNeural",
    "zombie":"hi-IN-MadhurNeural",
}

# {voice_key: text to speak} — fill with actual lesson content
phrases = {
    "boy": "नमस्ते",
    "girl": "नमस्ते",
    "man": "अलविदा",
    "woman": "शुभ प्रभात",
    "robot": "चलो सीखते हैं",
    "zombie": "बहुत अच्छा!",
}

for key, text in phrases.items():
    voice = VOICES[key]
    out = f"hi_{key}.mp3"
    subprocess.run([
        "edge-tts", "--voice", voice,
        "--text", text, "--write-media", out
    ])
    print(f"Generated {out}")
```

## Dual-language fallback (if running in browser, no mp3s)

Use Web Speech API directly — zero files, works in Chrome/Edge:

```typescript
function speakHindi(text: string, voice?: 'boy' | 'girl') {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'hi-IN'
  // Browser picks its own Hindi voice; no file needed
  window.speechSynthesis.speak(utterance)
}
```

Falls back gracefully if no Hindi voice is available — shows text but plays no audio. Meets the "audio can be optional/placeholder" requirement.

## File naming convention

```text
frontend/duolingo-clone/public/assets/
├── es_boy.mp3        ← existing Spanish voice
├── es_girl.mp3
├── es_man.mp3
├── es_woman.mp3
├── es_robot.mp3
├── es_zombie.mp3
├── hi_boy.mp3        ← to generate
├── hi_girl.mp3
├── hi_man.mp3
├── hi_woman.mp3
├── hi_robot.mp3
├── hi_zombie.mp3
└── ... (future languages: fr_boy.mp3, de_boy.mp3, etc.)
```

Each `lang_voice.mp3` is the TTS output for that voice persona reading the exercise text in that language. The API serves whichever `hi_*.mp3` matches the current exercise's assigned speaker persona.

## When to generate

After seed data (ticket 06) is finalized and Hindi exercises are written. Generate the 6 files, commit them to `public/assets/`, update ASSETS.md and USAGE.md with the new `hi_*` entries. Takes ~2 minutes.

## Scope note

Only generate if Hindi is the second seeded language. Spanish is the primary — Hindi audio is a nice-to-have that makes the app feel more real but is not required for a passing assignment.
