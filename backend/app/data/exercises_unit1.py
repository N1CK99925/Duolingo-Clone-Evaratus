"""Seed data for Unit 1: Letters & Basics (अक्षर, Basics 1, Intro)."""

UNIT = {
    "title": "Unit 1 \u2014 Letters & Basics",
    "description": "Read the script and say your first words",
    "skills": [
        {
            "title": "\u0905\u0915\u094d\u0937\u0930",
            "description": "Pair letters with sounds",
            "sort_order": 0,
        },
        {
            "title": "Basics 1",
            "description": "Form basic sentences",
            "sort_order": 1,
        },
        {
            "title": "Intro",
            "description": "Introduce people",
            "sort_order": 2,
        },
    ],
}

EXERCISES: dict[str, list[dict]] = {
    "\u0905\u0915\u094d\u0937\u0930": [
        {
            "type": "multiple_choice",
            "prompt": "Which Hindi letter makes the short 'a' sound?",
            "choices": ["\u0905", "\u0906", "\u0907", "\u0908"],
            "correct_index": 0,
            "explanation": "'\u0905' (a) is the first vowel of the Devanagari script.",
        },
        {
            "type": "fill_blank",
            "sentence": "The letter ___ makes the 'ka' sound.",
            "prompt": "Fill in the blank:",
            "choices": ["\u0915", "\u0917", "\u091f", "\u0928"],
            "correct_index": 0,
            "explanation": "'\u0915' represents the consonant 'ka'.",
        },
        {
            "type": "word_match",
            "prompt": "Match each Hindi letter to its sound:",
            "pairs": [
                {"hindi": "\u0905", "english": "a"},
                {"hindi": "\u0915", "english": "ka"},
                {"hindi": "\u0917", "english": "ga"},
                {"hindi": "\u092e", "english": "ma"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Read the letters aloud, then tap their sounds in order.",
            "sentence": "\u0905 \u0915 \u0916 \u0917",
            "correct": ["a", "ka", "kha", "ga"],
            "explanation": "Each Devanagari letter has its own sound; tap them left to right.",
        },
        {
            "type": "type_answer",
            "prompt": "Type the sound of the vowel '\u0905'.",
            "correct": ["a", "ah"],
            "explanation": "'\u0905' (a) is the first vowel of the Devanagari script.",
        },
    ],
    "Basics 1": [
        {
            "type": "multiple_choice",
            "prompt": "How do you say 'Hello' in Hindi?",
            "choices": [
                "\u0928\u092e\u0938\u094d\u0924\u0947 (Namaste)",
                "\u0936\u0941\u092d \u092a\u094d\u0930\u092d\u093e\u0924 (Good morning)",
                "\u0927\u0928\u094d\u092f\u0935\u093e\u0926 (Thank you)",
                "\u0939\u093e\u0901 (Yes)",
            ],
            "correct_index": 0,
            "explanation": (
                "'\u0928\u092e\u0938\u094d\u0924\u0947' (Namaste) is the common Hindi greeting."
            ),
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Paani) means water in Hindi.",
            "prompt": "Fill in the blank:",
            "choices": [
                "\u092a\u093e\u0928\u0940",
                "\u091a\u093e\u092f",
                "\u0926\u0942\u0927",
                "\u092b\u0932",
            ],
            "correct_index": 0,
            "explanation": "'\u092a\u093e\u0928\u0940' (Paani) means water.",
        },
        {
            "type": "word_match",
            "prompt": "Match the Hindi words to their English meanings:",
            "pairs": [
                {"hindi": "\u0928\u092e\u0938\u094d\u0924\u0947", "english": "Hello"},
                {"hindi": "\u0939\u093e\u0901", "english": "Yes"},
                {"hindi": "\u0928\u0939\u0940\u0902", "english": "No"},
                {"hindi": "\u092a\u093e\u0928\u0940", "english": "Water"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Tap the words to say 'I drink water' in English.",
            "sentence": "मैं पानी पीता हूँ",
            "correct": ["I", "drink", "water"],
            "explanation": "मैं पानी पीता हूँ means 'I drink water'.",
        },
        {
            "type": "type_answer",
            "prompt": "What does 'पानी' (Paani) mean? Type the answer.",
            "correct": ["water"],
            "explanation": "'पानी' (Paani) means water.",
        },
    ],
    "Intro": [
        {
            "type": "multiple_choice",
            "prompt": "How do you say 'My name is...' in Hindi?",
            "choices": [
                "\u092e\u0947\u0930\u093e \u0928\u093e\u092e... \u0939\u0948 (Mera naam... hai)",
                "\u092e\u0948\u0902 \u0920\u0940\u0915 \u0939\u0942\u0901 (Main theek hoon)",
                "\u0928\u092e\u0938\u094d\u0924\u0947 (Namaste)",
                "\u0906\u092a \u0915\u0948\u0938\u0947 \u0939\u0948\u0902 (Aap kaise hain)",
            ],
            "correct_index": 0,
            "explanation": (
                "'\u092e\u0947\u0930\u093e \u0928\u093e\u092e... \u0939\u0948' is used "
                "to introduce yourself."
            ),
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Main) means 'I' in Hindi.",
            "prompt": "Fill in the blank:",
            "choices": ["\u092e\u0948\u0902", "\u0924\u0941\u092e", "\u0935\u0939", "\u0939\u092e"],
            "correct_index": 0,
            "explanation": "'\u092e\u0948\u0902' (Main) means 'I'.",
        },
        {
            "type": "word_match",
            "prompt": "Match the pronouns:",
            "pairs": [
                {"hindi": "\u092e\u0948\u0902", "english": "I"},
                {"hindi": "\u0924\u0941\u092e", "english": "You"},
                {"hindi": "\u0935\u0939", "english": "He/She"},
                {"hindi": "\u0939\u092e", "english": "We"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Tap the words to say 'My name is Riya' in English.",
            "sentence": "मेरा नाम रिया है",
            "correct": ["My", "name", "is", "Riya"],
            "explanation": "मेरा नाम रिया है means 'My name is Riya'.",
        },
        {
            "type": "type_answer",
            "prompt": "What does 'मैं' (Main) mean? Type the answer.",
            "correct": ["I"],
            "explanation": "'मैं' (Main) means 'I'.",
        },
    ],
}