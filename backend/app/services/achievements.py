"""Achievement progress tracking and profile assembly."""

from datetime import datetime
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.gamification import Achievement, DailyGoal, Streak
from app.models.user import User, UserProgress


def _achievement_progress(db: Session, user: User, key: str) -> int:
    """Compute live progress for an achievement key from earned state."""
    if key == "first_lesson":
        return db.execute(
            select(func.count(UserProgress.id)).where(
                UserProgress.user_id == user.id,
                UserProgress.is_completed == 1,
            )
        ).scalar_one()
    if key == "xp_100":
        return user.total_xp
    if key == "streak_7":
        streak = db.execute(select(Streak).where(Streak.user_id == user.id)).scalar_one_or_none()
        return streak.current_streak if streak else 0
    if key == "gem_collector":
        return user.gems
    return 0


def update_achievements(db: Session, user: User, now: datetime | None = None) -> list[Achievement]:
    """Recompute achievement progress from earned state; unlock at thresholds."""
    now = now or datetime.utcnow()
    achievements = db.execute(
        select(Achievement).where(Achievement.user_id == user.id)
    ).scalars().all()
    for ach in achievements:
        progress = _achievement_progress(db, user, ach.key)
        ach.progress = min(progress, ach.goal)
        if ach.unlocked_at is None and progress >= ach.goal:
            ach.unlocked_at = now
    db.flush()
    return list(achievements)


def get_profile(db: Session, user: User) -> dict[str, Any]:
    """Build the profile response for the given user."""
    streak = db.execute(select(Streak).where(Streak.user_id == user.id)).scalar_one_or_none()
    daily = db.execute(select(DailyGoal).where(DailyGoal.user_id == user.id)).scalar_one_or_none()

    if daily is None:
        daily = DailyGoal(user_id=user.id, target_xp=50, xp_today=0)
        db.add(daily)
        db.flush()

    achievements = db.execute(
        select(Achievement).where(Achievement.user_id == user.id).order_by(Achievement.id)
    ).scalars().all()

    return {
        "username": user.username,
        "joined_date": user.created_at.strftime("%B %d, %Y"),
        "streak": streak.current_streak if streak else 0,
        "total_xp": user.total_xp,
        "gems": user.gems,
        "daily_goal_xp": daily.target_xp,
        "today_xp": daily.xp_today,
        "achievements": [
            {
                "id": ach.key,
                "title": ach.title,
                "description": ach.description,
                "icon": ach.icon,
                "unlocked": ach.unlocked_at is not None,
                "progress": ach.progress,
                "max_progress": ach.goal,
            }
            for ach in achievements
        ],
    }
