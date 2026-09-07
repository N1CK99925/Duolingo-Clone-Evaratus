"""Seed data for Unit 3: Food & Numbers (Food, Numbers)."""

UNIT = {
    "title": "Unit 3 \u2014 Food & Numbers",
    "description": "Order food and use numbers",
    "skills": [
        {
            "title": "Food",
            "description": "Talk about food",
            "sort_order": 0,
        },
        {
            "title": "Numbers",
            "description": "Use numbers",
            "sort_order": 1,
        },
    ],
}

EXERCISES: dict[str, list[dict]] = {
    "Food": [
        {
            "type": "multiple_choice",
            "prompt": "What does '\u0930\u094b\u091f\u0940' (Roti) mean?",
            "choices": ["Bread/Flatbread", "Rice", "Vegetable", "Lentils"],
            "correct_index": 0,
            "explanation": "'\u0930\u094b\u091f\u0940' (Roti) is a common Indian flatbread.",
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Chawal) is the Hindi word for rice.",
            "prompt": "Fill in the blank:",
            "choices": [
                "\u091a\u093e\u0935\u0932",
                "\u0930\u094b\u091f\u0940",
                "\u0926\u093e\u0932",
                "\u0938\u092c\u094d\u091c\u0940",
            ],
            "correct_index": 0,
            "explanation": "'\u091a\u093e\u0935\u0932' (Chawal) means rice.",
        },
        {
            "type": "word_match",
            "prompt": "Match the food words:",
            "pairs": [
                {"hindi": "\u0930\u094b\u091f\u0940", "english": "Bread"},
                {"hindi": "\u091a\u093e\u0935\u0932", "english": "Rice"},
                {"hindi": "\u0926\u093e\u0932", "english": "Lentils"},
                {"hindi": "\u0938\u092c\u094d\u091c\u0940", "english": "Vegetable"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Tap the words to say 'I eat rice' in English.",
            "sentence": "मैं चावल खाता हूँ",
            "correct": ["I", "eat", "rice"],
            "explanation": "मैं चावल खाता हूँ means 'I eat rice'.",
        },
        {
            "type": "type_answer",
            "prompt": "What does '\u0930\u094b\u091f\u0940' (Roti) mean? Type the answer.",
            "correct": ["bread", "flatbread", "flat bread"],
            "explanation": "'\u0930\u094b\u091f\u0940' (Roti) is a common Indian flatbread.",
        },
    ],
    "Numbers": [
        {
            "type": "multiple_choice",
            "prompt": "What is '\u090f\u0915' (Ek) in English?",
            "choices": ["One", "Two", "Three", "Four"],
            "correct_index": 0,
            "explanation": "'\u090f\u0915' (Ek) means one.",
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Do) means two in Hindi.",
            "prompt": "Fill in the blank:",
            "choices": [
                "\u0926\u094b",
                "\u0924\u0940\u0928",
                "\u091a\u093e\u0930",
                "\u092a\u093e\u0901\u091a",
            ],
            "correct_index": 0,
            "explanation": "'\u0926\u094b' (Do) means two.",
        },
        {
            "type": "word_match",
            "prompt": "Match numbers to their Hindi words:",
            "pairs": [
                {"hindi": "\u090f\u0915", "english": "One"},
                {"hindi": "\u0926\u094b", "english": "Two"},
                {"hindi": "\u0924\u0940\u0928", "english": "Three"},
                {"hindi": "\u091a\u093e\u0930", "english": "Four"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Tap the words to count 'one two three'.",
            "sentence": "एक दो तीन",
            "correct": ["one", "two", "three"],
            "explanation": "'एक', 'दो', 'तीन' mean one, two, three.",
        },
        {
            "type": "type_answer",
            "prompt": "How do you say '\u091a\u093e\u0930' (Char) in English?",
            "correct": ["four"],
            "explanation": "'\u091a\u093e\u0930' (Char) means four.",
        },
    ],
}