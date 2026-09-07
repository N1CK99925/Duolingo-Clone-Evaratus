"""Daily XP goal tracking."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.gamification import DailyGoal


def record_daily_xp(
    db: Session, user_id: int, amount: int, now: datetime | None = None
) -> DailyGoal:
    """Add XP to today's daily-goal progress, resetting when the date rolls over."""
    now = now or datetime.utcnow()
    daily = db.execute(select(DailyGoal).where(DailyGoal.user_id == user_id)).scalar_one_or_none()
    if daily is None:
        daily = DailyGoal(user_id=user_id)
        db.add(daily)
        db.flush()

    today_str = now.strftime("%Y-%m-%d")
    if daily.last_practice_date != today_str:
        daily.xp_today = 0
        daily.last_practice_date = today_str
    daily.xp_today += amount
    db.flush()
    return daily


def set_daily_goal(db: Session, user_id: int, target_xp: int) -> DailyGoal:
    """Set the user's daily XP goal target."""
    daily = db.execute(select(DailyGoal).where(DailyGoal.user_id == user_id)).scalar_one_or_none()
    if daily is None:
        daily = DailyGoal(user_id=user_id, target_xp=target_xp)
        db.add(daily)
    else:
        daily.target_xp = target_xp
    db.flush()
    return daily
