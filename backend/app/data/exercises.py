"""Seed content index: courses, units, and exercise templates.

Combines per-unit exercise data and exposes the merged exercise lookup.
"""

from app.data.exercises_unit1 import EXERCISES as UNIT1_EXERCISES
from app.data.exercises_unit1 import UNIT as UNIT1
from app.data.exercises_unit2 import EXERCISES as UNIT2_EXERCISES
from app.data.exercises_unit2 import UNIT as UNIT2
from app.data.exercises_unit3 import EXERCISES as UNIT3_EXERCISES
from app.data.exercises_unit3 import UNIT as UNIT3

UNITS = [UNIT1, UNIT2, UNIT3]

SKILL_EXERCISES: dict[str, list[dict]] = {
    **UNIT1_EXERCISES,
    **UNIT2_EXERCISES,
    **UNIT3_EXERCISES,
}

DEFAULT_EXERCISES: list[dict] = [
    {
        "type": "multiple_choice",
        "prompt": "Select the correct Hindi word:",
        "choices": [
            "\u0928\u092e\u0938\u094d\u0924\u0947",
            "\u0939\u093e\u0901",
            "\u0928\u0939\u0940\u0902",
            "\u092a\u093e\u0928\u0940",
        ],
        "correct_index": 0,
        "explanation": "Correct choice selected.",
    },
    {
        "type": "fill_blank",
        "sentence": "___ means hello in Hindi.",
        "prompt": "Fill in the blank:",
        "choices": [
            "\u0928\u092e\u0938\u094d\u0924\u0947",
            "\u0939\u093e\u0901",
            "\u0928\u0939\u0940\u0902",
            "\u092a\u093e\u0928\u0940",
        ],
        "correct_index": 0,
        "explanation": "'\u0928\u092e\u0938\u094d\u0924\u0947' (Namaste) means hello.",
    },
    {
        "type": "word_match",
        "prompt": "Match the words:",
        "pairs": [
            {"hindi": "\u0928\u092e\u0938\u094d\u0924\u0947", "english": "Hello"},
            {"hindi": "\u0939\u093e\u0901", "english": "Yes"},
            {"hindi": "\u0928\u0939\u0940\u0902", "english": "No"},
            {"hindi": "\u092a\u093e\u0928\u0940", "english": "Water"},
        ],
    },
    {
        "type": "tap_words",
        "prompt": "Tap the words to say 'Hello, I am happy' in English.",
        "sentence": "नमस्ते मैं खुश हूँ",
        "correct": ["Hello", "I", "am", "happy"],
        "explanation": "नमस्ते मैं खुश हूँ means 'Hello, I am happy'.",
    },
    {
        "type": "type_answer",
        "prompt": "What does 'नमस्ते' (Namaste) mean? Type the answer.",
        "correct": ["hello"],
        "explanation": "'नमस्ते' (Namaste) means hello.",
    },
]