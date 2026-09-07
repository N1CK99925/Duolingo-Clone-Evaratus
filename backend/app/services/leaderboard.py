"""Weekly leaderboard: XP tracking, ranking, and current-user marking."""

from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.gamification import LeaderboardEntry
from app.models.user import User


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
