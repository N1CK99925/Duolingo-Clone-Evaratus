"""Seed the database with the Hindi course and a default learner.

Content direction matches the real Duolingo Hindi-from-English course (Section 1):
https://duolingodata.com/dat/hifen32-d.html — skill titles are real Devanagari
where Duolingo teaches the script early (Letters), otherwise the common English
skill name Duolingo uses. Descriptions stay English (UI language).

Idempotent: safe to run on every startup. If content already exists, it is
left untouched (no duplicates introduced).
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Course, Lesson, Skill, Unit
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
        "title": "Unit 1 — Letters & Basics",
        "description": "Read the script and say your first words",
        "skills": [
            {
                "title": "अक्षर",  # Letters 1
                "description": "Pair letters with sounds",
                "sort_order": 0,
            },
            {
                "title": "बasics",  # Basics 1: English label, Duolingo labels this skill in English
                "title_en": "Basics",
                "description": "Form basic sentences",
                "sort_order": 1,
            },
            {
                "title": "परिचय",  # Intro
                "description": "Introduce people",
                "sort_order": 2,
            },
        ],
    },
    {
        "title": "Unit 2 — People & Animals",
        "description": "Talk about family, friends and pets",
        "skills": [
            {
                "title": "परिवार",  # Family
                "description": "Describe your family",
                "sort_order": 0,
            },
            {
                "title": "जानवर",  # Animals
                "description": "Talk about animals",
                "sort_order": 1,
            },
        ],
    },
    {
        "title": "Unit 3 — Food & Numbers",
        "description": "Order food and use numbers",
        "skills": [
            {
                "title": "भोजन",  # Food
                "description": "Talk about food",
                "sort_order": 0,
            },
            {
                "title": "संख्याएँ",  # Numbers
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


import json

from app.models.course import Course, Exercise, Lesson, Skill, Unit
from app.models.gamification import Hearts, Streak
from app.models.user import User

# Exercise templates for seeded skills
SKILL_EXERCISES = {
    "अक्षर": [
        {
            "prompt": "Which Hindi letter makes the short 'a' sound?",
            "choices": ["अ", "आ", "इ", "ई"],
            "correct_index": 0,
            "explanation": "'अ' (a) is the first vowel of the Devanagari script.",
        },
        {
            "prompt": "Select the transliteration for the letter 'क':",
            "choices": ["ka", "kha", "ga", "gha"],
            "correct_index": 0,
            "explanation": "'क' represents the consonant 'ka'.",
        },
        {
            "prompt": "Which letter represents the 'i' sound?",
            "choices": ["इ", "उ", "ए", "ओ"],
            "correct_index": 0,
            "explanation": "'इ' makes the short 'i' sound.",
        },
    ],
    "Basics": [
        {
            "prompt": "How do you say 'Hello' in Hindi?",
            "choices": ["नमस्ते (Namaste)", "शुभ प्रभात (Good morning)", "धन्यवाद (Thank you)", "हाँ (Yes)"],
            "correct_index": 0,
            "explanation": "'नमस्ते' (Namaste) is the common Hindi greeting.",
        },
        {
            "prompt": "Select the Hindi word for 'Water':",
            "choices": ["पानी (Paani)", "चाय (Chai)", "दूध (Doodh)", "फल (Phal)"],
            "correct_index": 0,
            "explanation": "'पानी' (Paani) means water.",
        },
        {
            "prompt": "What does 'हाँ' (Haan) mean?",
            "choices": ["Yes", "No", "Thanks", "Please"],
            "correct_index": 0,
            "explanation": "'हाँ' (Haan) means 'Yes'.",
        },
    ],
    "परिचय": [
        {
            "prompt": "How do you say 'My name is...' in Hindi?",
            "choices": ["मेरा नाम... है (Mera naam... hai)", "मैं ठीक हूँ (Main theek hoon)", "नमस्ते (Namaste)", "आप कैसे हैं (Aap kaise hain)"],
            "correct_index": 0,
            "explanation": "'मेरा नाम... है' is used to introduce yourself.",
        },
        {
            "prompt": "What does 'मैं' (Main) mean?",
            "choices": ["I", "You", "He", "They"],
            "correct_index": 0,
            "explanation": "'मैं' (Main) means 'I'.",
        },
        {
            "prompt": "Select the translation for 'Good / Okay':",
            "choices": ["ठीक (Theek)", "बड़ा (Bada)", "छोटा (Chhota)", "अच्छा (Achha)"],
            "correct_index": 0,
            "explanation": "'ठीक' (Theek) means fine/okay.",
        },
    ],
}

DEFAULT_EXERCISES = [
    {
        "prompt": "Select the correct Hindi word:",
        "choices": ["नमस्ते", "हाँ", "नहीं", "पानी"],
        "correct_index": 0,
        "explanation": "Correct choice selected.",
    },
    {
        "prompt": "Choose the best translation:",
        "choices": ["Yes", "No", "Water", "Tea"],
        "correct_index": 0,
        "explanation": "Correct choice selected.",
    },
    {
        "prompt": "Select the correct option:",
        "choices": ["Option A", "Option B", "Option C", "Option D"],
        "correct_index": 0,
        "explanation": "Correct option selected.",
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
                    title=f"{skill.title} — Lesson 1",
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
                exercise = Exercise(
                    lesson_id=lesson.id,
                    exercise_type="multiple_choice",
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
