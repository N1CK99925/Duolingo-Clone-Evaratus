"""Gamification service: streak, daily goal, leaderboard, profile (VS4)."""

from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.gamification import Achievement, DailyGoal, LeaderboardEntry, Streak
from app.models.user import User, UserProgress


def _current_week_start(db: Session) -> str:
    """Return the Monday of the current week as YYYY-MM-DD."""
    today = datetime.utcnow().date()
    monday = today - timedelta(days=today.weekday())
    return monday.isoformat()


def get_or_create_leaderboard_entry(db: Session, user_id: int) -> LeaderboardEntry:
    """Return this week's leaderboard entry for the user, creating if absent."""
    week_start = _current_week_start(db)
    entry = db.execute(
        select(LeaderboardEntry).where(
            LeaderboardEntry.user_id == user_id,
            LeaderboardEntry.week_start == week_start,
        )
    ).scalar_one_or_none()
    if entry is None:
        entry = LeaderboardEntry(user_id=user_id, weekly_xp=0, week_start=week_start)
        db.add(entry)
        db.flush()
    return entry


def add_weekly_xp(db: Session, user_id: int, amount: int) -> None:
    """Add XP to the current week's leaderboard entry."""
    entry = get_or_create_leaderboard_entry(db, user_id)
    entry.weekly_xp += amount


def get_leaderboard(db: Session) -> list[dict[str, Any]]:
    """Return top leaderboard entries for the current week, with username."""
    week_start = _current_week_start(db)
    rows = (
        db.execute(
            select(LeaderboardEntry, User.username)
            .join(User, User.id == LeaderboardEntry.user_id)
            .where(LeaderboardEntry.week_start == week_start)
            .order_by(LeaderboardEntry.weekly_xp.desc(), User.username)
        )
        .all()
    )
    return [
        {
            "rank": idx + 1,
            "user_id": entry.user_id,
            "username": username,
            "weekly_xp": entry.weekly_xp,
            "is_current_user": False,
        }
        for idx, (entry, username) in enumerate(rows)
    ]


def mark_current_user_in_leaderboard(
    entries: list[dict[str, Any]], current_user_id: int
) -> list[dict[str, Any]]:
    """Mark the current user's entry in the leaderboard list."""
    for entry in entries:
        if entry["user_id"] == current_user_id:
            entry["is_current_user"] = True
            break
    return entries


def update_streak(db: Session, user_id: int, now: datetime | None = None) -> Streak:
    """Record practice on `now`'s date: +1 on consecutive days, reset on gap.

    `now` is injectable so tests can simulate today/yesterday/broken sequences.
    """
    now = now or datetime.utcnow()
    streak = db.execute(select(Streak).where(Streak.user_id == user_id)).scalar_one_or_none()
    if streak is None:
        streak = Streak(user_id=user_id)
        db.add(streak)
        db.flush()

    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    if streak.last_practice_date == today_str:
        pass  # already practiced today; streak unchanged
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


def get_default_user(db: Session) -> User:
    """Return the default learner for use in leaderboard/profile endpoints."""
    from app.core.config import settings

    user = db.execute(
        select(User).where(User.username == settings.default_username)
    ).scalar_one_or_none()
    if user is None:
        raise LookupError("Default learner not found. Run seed first.")
    return user
