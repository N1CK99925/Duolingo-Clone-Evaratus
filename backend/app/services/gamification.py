"""Gamification facade: re-exports from focused sub-modules.

All public symbols remain importable from this module for backward
compatibility with routers and tests.
"""

from app.services.achievements import get_profile, update_achievements  # noqa: F401
from app.services.daily_goal import record_daily_xp, set_daily_goal  # noqa: F401
from app.services.hearts import (  # noqa: F401
    get_hearts_status,
    get_or_create_hearts,
    refill_hearts,
    regen_hearts,
)
from app.services.leaderboard import (  # noqa: F401
    add_weekly_xp,
    get_leaderboard,
    mark_current_user_in_leaderboard,
)
from app.services.streak import update_streak  # noqa: F401
from app.services.user import get_default_user  # noqa: F401
