"""Streak tracking: consecutive practice day detection."""

from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.gamification import Streak


def update_streak(db: Session, user_id: int, now: datetime | None = None) -> Streak:
    """Record practice on `now`'s date: +1 on consecutive days, reset on gap."""
    now = now or datetime.utcnow()
    streak = db.execute(select(Streak).where(Streak.user_id == user_id)).scalar_one_or_none()
    if streak is None:
        streak = Streak(user_id=user_id)
        db.add(streak)
        db.flush()

    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    if streak.last_practice_date == today_str:
        pass
    elif streak.last_practice_date == yesterday_str:
        streak.current_streak += 1
        streak.last_practice_date = today_str
    else:
        streak.current_streak = 1
        streak.last_practice_date = today_str

    if streak.current_streak > (streak.longest_streak or 0):
        streak.longest_streak = streak.current_streak
    streak.updated_at = now
    db.flush()
    return streak
