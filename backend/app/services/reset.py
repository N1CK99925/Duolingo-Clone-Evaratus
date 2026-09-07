"""Reset the default learner's progress back to a fresh start.

Keeps the course content (units/skills/lessons) and rival leaderboard
entries; only the learner's progress and gamification state is wiped.
"""

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.gamification import (
    Achievement,
    ChestClaim,
    DailyGoal,
    Hearts,
    LeaderboardEntry,
    Streak,
)
from app.models.user import UserProgress
from app.services.user import get_default_user


def reset_progress(db: Session) -> None:
    """Wipe the learner's progress and gamification rows, then re-seed defaults."""
    user = get_default_user(db)

    for model in (UserProgress, Achievement, ChestClaim, LeaderboardEntry):
        db.execute(delete(model).where(model.user_id == user.id))

    streak = db.execute(select(Streak).where(Streak.user_id == user.id)).scalar_one_or_none()
    if streak is not None:
        streak.current_streak = 0
        streak.longest_streak = 0
        streak.last_practice_date = None

    hearts = db.execute(select(Hearts).where(Hearts.user_id == user.id)).scalar_one_or_none()
    if hearts is not None:
        hearts.current_hearts = hearts.max_hearts
        hearts.last_refill_at = None

    daily_goal = db.execute(
        select(DailyGoal).where(DailyGoal.user_id == user.id)
    ).scalar_one_or_none()
    if daily_goal is not None:
        daily_goal.xp_today = 0
        daily_goal.last_practice_date = None

    user.total_xp = 0
    user.gems = 0

    db.commit()