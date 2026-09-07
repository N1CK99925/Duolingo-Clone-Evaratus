"""Default achievement definitions seeded for every new learner."""

DEFAULT_ACHIEVEMENTS: list[dict] = [
    {
        "key": "first_lesson",
        "title": "First Steps",
        "description": "Complete your first lesson",
        "icon": "\U0001f331",
        "goal": 1,
        "progress": 0,
        "unlocked_at": None,
    },
    {
        "key": "xp_100",
        "title": "Getting Started",
        "description": "Earn 100 total XP",
        "icon": "\u2728",
        "goal": 100,
        "progress": 0,
        "unlocked_at": None,
    },
    {
        "key": "streak_7",
        "title": "Week Warrior",
        "description": "Maintain a 7-day streak",
        "icon": "\U0001f525",
        "goal": 7,
        "progress": 0,
        "unlocked_at": None,
    },
    {
        "key": "gem_collector",
        "title": "Gem Collector",
        "description": "Earn 500 gems total",
        "icon": "\U0001f48e",
        "goal": 500,
        "progress": 0,
        "unlocked_at": None,
    },
]
