"""Seed the database with the Hindi course and a default learner.

Content direction matches the real Duolingo Hindi-from-English course (Section 1):
https://duolingodata.com/dat/hifen32-d.html — skill titles are real Devanagari
where Duolingo teaches the script early (Letters), otherwise the common English
skill name Duolingo uses. Descriptions stay English (UI language).

Idempotent: safe to run on every startup. If content already exists, it is
left untouched (no duplicates introduced).

VS3: Exercise templates now include multiple_choice, fill_blank, and word_match types.
No audio exercises are seeded (audio infrastructure TBD).
"""

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Course, Exercise, Lesson, Skill, Unit
from app.models.gamification import Hearts, Streak
from app.models.user import User

# --- Course content: Hindi for English speakers (Duolingo Section 1 shape) ---
#
# Duolingo Hindi Section 1 has these skill topics (in tree order):
#   Letters 1-4, Basics 1, Basics 2, Plurals, Intro, Family, Animals,
#   Activity, Adjectives, Food, Numbers, Questions, Home
# We keep the same 3-unit split the ticket asked for and mirror the first ~7
# skills so the home path reads like the real course.
#
# Titles use Devanagari where that is the Duolingo Hindi course's own label
# (the alphabet skills); everything else keeps the English topic name Duolingo
# uses, because the course itself labels those skills in English.

UNITS = [
    {
        "title": "Unit 1 \u2014 Letters & Basics",
        "description": "Read the script and say your first words",
        "skills": [
            {
                "title": "\u0905\u0915\u094d\u0937\u0930",  # Letters 1
                "description": "Pair letters with sounds",
                "sort_order": 0,
            },
            {
                "title": "\u092casics",  # Basics 1: English label
                "title_en": "Basics",
                "description": "Form basic sentences",
                "sort_order": 1,
            },
            {
                "title": "\u092a\u0930\u093f\u091a\u092f",  # Intro
                "description": "Introduce people",
                "sort_order": 2,
            },
        ],
    },
    {
        "title": "Unit 2 \u2014 People & Animals",
        "description": "Talk about family, friends and pets",
        "skills": [
            {
                "title": "\u092a\u0930\u093f\u0935\u093e\u0930",  # Family
                "description": "Describe your family",
                "sort_order": 0,
            },
            {
                "title": "\u091c\u093e\u0928\u0935\u0930",  # Animals
                "description": "Talk about animals",
                "sort_order": 1,
            },
        ],
    },
    {
        "title": "Unit 3 \u2014 Food & Numbers",
        "description": "Order food and use numbers",
        "skills": [
            {
                "title": "\u092d\u094b\u091c\u0928",  # Food
                "description": "Talk about food",
                "sort_order": 0,
            },
            {
                "title": "\u0938\u0902\u0916\u094d\u092f\u093e\u090f\u0901",  # Numbers
                "description": "Use numbers",
                "sort_order": 1,
            },
        ],
    },
]


def _skill_title(skill_data: dict) -> str:
    """Return the display title for a skill.

    Duolingo keeps the alphabet skills in Devanagari and the topic skills in
    English; we mimic that: prefer a Hindi title, fall back to the English one.
    """
    return skill_data.get("title_en") or skill_data["title"]


# ---------------------------------------------------------------------------
# Exercise templates — VS3: multiple_choice + fill_blank + word_match
# NOTE: No audio exercises (audio infrastructure TBD for a later sprint).
# ---------------------------------------------------------------------------

SKILL_EXERCISES: dict[str, list[dict]] = {
    # \u0905\u0915\u094d\u0937\u0930 = Letters
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
    ],
    # Basics
    "Basics": [
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
            "explanation": "'\u0928\u092e\u0938\u094d\u0924\u0947' (Namaste) is the common Hindi greeting.",
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Paani) means water in Hindi.",
            "prompt": "Fill in the blank:",
            "choices": ["\u092a\u093e\u0928\u0940", "\u091a\u093e\u092f", "\u0926\u0942\u0927", "\u092b\u0932"],
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
    ],
    # \u092a\u0930\u093f\u091a\u092f = Intro
    "\u092a\u0930\u093f\u091a\u092f": [
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
            "explanation": "'\u092e\u0947\u0930\u093e \u0928\u093e\u092e... \u0939\u0948' is used to introduce yourself.",
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
    ],
    # \u092a\u0930\u093f\u0935\u093e\u0930 = Family
    "\u092a\u0930\u093f\u0935\u093e\u0930": [
        {
            "type": "multiple_choice",
            "prompt": "How do you say 'Mother' in Hindi?",
            "choices": ["\u092e\u093e\u0901 (Maa)", "\u092a\u093f\u0924\u093e\u091c\u0940 (Pitaji)", "\u092d\u093e\u0908 (Bhai)", "\u092c\u0939\u0928 (Behen)"],
            "correct_index": 0,
            "explanation": "'\u092e\u093e\u0901' (Maa) means mother.",
        },
        {
            "type": "fill_blank",
            "sentence": "My ___ (Bhai) is my brother.",
            "prompt": "Fill in the blank:",
            "choices": ["\u092d\u093e\u0908", "\u092c\u0939\u0928", "\u092e\u093e\u0901", "\u092a\u093f\u0924\u093e\u091c\u0940"],
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
    ],
    # \u091c\u093e\u0928\u0935\u0930 = Animals
    "\u091c\u093e\u0928\u0935\u0930": [
        {
            "type": "multiple_choice",
            "prompt": "What is the Hindi word for 'Dog'?",
            "choices": ["\u0915\u0941\u0924\u094d\u0924\u093e (Kutta)", "\u092c\u093f\u0932\u094d\u0932\u0940 (Billi)", "\u0917\u093e\u092f (Gaay)", "\u0918\u094b\u0921\u093c\u093e (Ghoda)"],
            "correct_index": 0,
            "explanation": "'\u0915\u0941\u0924\u094d\u0924\u093e' (Kutta) means dog.",
        },
        {
            "type": "fill_blank",
            "sentence": "___ (Billi) is the Hindi word for cat.",
            "prompt": "Fill in the blank:",
            "choices": ["\u092c\u093f\u0932\u094d\u0932\u0940", "\u0915\u0941\u0924\u094d\u0924\u093e", "\u0917\u093e\u092f", "\u0918\u094b\u0921\u093c\u093e"],
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
    ],
    # \u092d\u094b\u091c\u0928 = Food
    "\u092d\u094b\u091c\u0928": [
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
            "choices": ["\u091a\u093e\u0935\u0932", "\u0930\u094b\u091f\u0940", "\u0926\u093e\u0932", "\u0938\u092c\u094d\u091c\u0940"],
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
    ],
    # \u0938\u0902\u0916\u094d\u092f\u093e\u090f\u0901 = Numbers
    "\u0938\u0902\u0916\u094d\u092f\u093e\u090f\u0901": [
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
            "choices": ["\u0926\u094b", "\u0924\u0940\u0928", "\u091a\u093e\u0930", "\u092a\u093e\u0901\u091a"],
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
    ],
}

DEFAULT_EXERCISES: list[dict] = [
    {
        "type": "multiple_choice",
        "prompt": "Select the correct Hindi word:",
        "choices": ["\u0928\u092e\u0938\u094d\u0924\u0947", "\u0939\u093e\u0901", "\u0928\u0939\u0940\u0902", "\u092a\u093e\u0928\u0940"],
        "correct_index": 0,
        "explanation": "Correct choice selected.",
    },
    {
        "type": "fill_blank",
        "sentence": "___ means hello in Hindi.",
        "prompt": "Fill in the blank:",
        "choices": ["\u0928\u092e\u0938\u094d\u0924\u0947", "\u0939\u093e\u0901", "\u0928\u0939\u0940\u0902", "\u092a\u093e\u0928\u0940"],
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
]


def seed_content(session: Session) -> Course:
    """Create the Hindi course if absent; return the active course."""
    existing = session.execute(
        select(Course).where(Course.lang_target == "hi", Course.is_active == 1)
    ).scalar_one_or_none()

    if existing:
        course = existing
    else:
        course = Course(
            title="Hindi",
            subtitle="Learn Hindi from English",
            lang_source="en",
            lang_target="hi",
            is_active=1,
        )
        session.add(course)
        session.flush()

        for u_order, unit_data in enumerate(UNITS):
            unit = Unit(
                course_id=course.id,
                title=unit_data["title"],
                description=unit_data["description"],
                sort_order=u_order,
            )
            session.add(unit)
            session.flush()

            for s_order, skill_data in enumerate(unit_data["skills"]):
                skill = Skill(
                    unit_id=unit.id,
                    title=_skill_title(skill_data),
                    description=skill_data.get("description"),
                    sort_order=s_order,
                    skill_color="#58CC02",
                    is_locked=0,
                )
                session.add(skill)
                session.flush()

                lesson = Lesson(
                    skill_id=skill.id,
                    title=f"{skill.title} \u2014 Lesson 1",
                    sort_order=0,
                    xp_reward=10,
                )
                session.add(lesson)
                session.flush()

    # Ensure exercises exist for all lessons
    all_lessons = session.execute(
        select(Lesson)
        .join(Skill)
        .join(Unit)
        .where(Unit.course_id == course.id)
    ).scalars().all()

    for lesson in all_lessons:
        ex_count = session.execute(
            select(Exercise).where(Exercise.lesson_id == lesson.id)
        ).scalars().all()
        if not ex_count:
            skill = session.get(Skill, lesson.skill_id)
            skill_title = skill.title if skill else ""
            templates = SKILL_EXERCISES.get(skill_title, DEFAULT_EXERCISES)
            for idx, ex_data in enumerate(templates):
                # Use the "type" field from template; fall back to "multiple_choice".
                ex_type = ex_data.get("type", "multiple_choice")
                exercise = Exercise(
                    lesson_id=lesson.id,
                    exercise_type=ex_type,
                    exercise_data=json.dumps(ex_data),
                    sort_order=idx,
                    difficulty=1,
                )
                session.add(exercise)

    return course


def seed_user(session: Session, username: str) -> User:
    """Get or create the default learner."""
    user = session.execute(select(User).where(User.username == username)).scalar_one_or_none()
    if user:
        return user

    user = User(username=username, total_xp=0, gems=0)
    session.add(user)
    session.flush()

    session.add(Streak(user_id=user.id))
    session.add(Hearts(user_id=user.id))
    return user


def run_seed(session: Session) -> None:
    """Seed course content + default user. Idempotent."""
    seed_content(session)
    from app.core.config import settings

    seed_user(session, settings.default_username)
    session.commit()
