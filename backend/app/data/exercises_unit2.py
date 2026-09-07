"""Seed data for Unit 2: People & Animals (Family, Animals)."""

UNIT = {
    "title": "Unit 2 \u2014 People & Animals",
    "description": "Talk about family, friends and pets",
    "skills": [
        {
            "title": "Family",
            "description": "Describe your family",
            "sort_order": 0,
        },
        {
            "title": "Animals",
            "description": "Talk about animals",
            "sort_order": 1,
        },
    ],
}

EXERCISES: dict[str, list[dict]] = {
    "Family": [
        {
            "type": "multiple_choice",
            "prompt": "How do you say 'Mother' in Hindi?",
            "choices": [
                "\u092e\u093e\u0901 (Maa)",
                "\u092a\u093f\u0924\u093e\u091c\u0940 (Pitaji)",
                "\u092d\u093e\u0908 (Bhai)",
                "\u092c\u0939\u0928 (Behen)",
            ],
            "correct_index": 0,
            "explanation": "'\u092e\u093e\u0901' (Maa) means mother.",
        },
        {
            "type": "fill_blank",
            "sentence": "My ___ (Bhai) is my brother.",
            "prompt": "Fill in the blank:",
            "choices": [
                "\u092d\u093e\u0908",
                "\u092c\u0939\u0928",
                "\u092e\u093e\u0901",
                "\u092a\u093f\u0924\u093e\u091c\u0940",
            ],
            "correct_index": 0,
            "explanation": "'\u092d\u093e\u0908' (Bhai) means brother.",
        },
        {
            "type": "word_match",
            "prompt": "Match family members:",
            "pairs": [
                {"hindi": "\u092e\u093e\u0901", "english": "Mother"},
                {"hindi": "\u092a\u093f\u0924\u093e\u091c\u0940", "english": "Father"},
                {"hindi": "\u092d\u093e\u0908", "english": "Brother"},
                {"hindi": "\u092c\u0939\u0928", "english": "Sister"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Tap the words to say 'I and my brother' in English.",
            "sentence": "मैं और मेरा भाई",
            "correct": ["I", "and", "my", "brother"],
            "explanation": "मैं और मेरा भाई means 'I and my brother'.",
        },
        {
            "type": "type_answer",
            "prompt": "What does '\u092e\u093e\u0901' (Maa) mean? Type the answer.",
            "correct": ["mother"],
            "explanation": "'\u092e\u093e\u0901' (Maa) means mother.",
        },
    ],
    "Animals": [
        {
            "type": "multiple_choice",
            "prompt": "What is the Hindi word for 'Dog'?",
            "choices": [
                "\u0915\u0941\u0924\u094d\u0924\u093e (Kutta)",
                "\u092c\u093f\u0932\u094d\u0932\u0940 (Billi)",
                "\u0917\u093e\u092f (Gaay)",
                "\u0918\u094b\u0921\u093c\u093e (Ghoda)",
            ],
            "correct_index": 0,
            "explanation": "'\u0915\u0941\u0924\u094d\u0924\u093e' (Kutta) means dog.",
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Billi) is the Hindi word for cat.",
            "prompt": "Fill in the blank:",
            "choices": [
                "\u092c\u093f\u0932\u094d\u0932\u0940",
                "\u0915\u0941\u0924\u094d\u0924\u093e",
                "\u0917\u093e\u092f",
                "\u0918\u094b\u0921\u093c\u093e",
            ],
            "correct_index": 0,
            "explanation": "'\u092c\u093f\u0932\u094d\u0932\u0940' (Billi) means cat.",
        },
        {
            "type": "word_match",
            "prompt": "Match the animals:",
            "pairs": [
                {"hindi": "\u0915\u0941\u0924\u094d\u0924\u093e", "english": "Dog"},
                {"hindi": "\u092c\u093f\u0932\u094d\u0932\u0940", "english": "Cat"},
                {"hindi": "\u0917\u093e\u092f", "english": "Cow"},
                {"hindi": "\u0918\u094b\u0921\u093c\u093e", "english": "Horse"},
            ],
        },
        {
            "type": "tap_words",
            "prompt": "Tap the words to say 'dog and cat' in English.",
            "sentence": "कुत्ता और बिल्ली",
            "correct": ["dog", "and", "cat"],
            "explanation": "कुत्ता और बिल्ली means 'dog and cat'.",
        },
        {
            "type": "type_answer",
            "prompt": "What does 'गाय' (Gaay) mean? Type the answer.",
            "correct": ["cow"],
            "explanation": "'गाय' (Gaay) means cow.",
        },
    ],
}