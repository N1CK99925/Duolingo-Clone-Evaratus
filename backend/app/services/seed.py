"""Seed the database with defaults: user, gamification rows, and rivals.

Idempotent: safe to run on every startup. Content course seeding lives in
`seed_content`; content already present is left untouched.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.data.achievements_data import DEFAULT_ACHIEVEMENTS
from app.data.rivals import LEADERBOARD_RIVALS
from app.models.gamification import Achievement, DailyGoal, Hearts, LeaderboardEntry, Streak
from app.models.user import User
from app.services.seed_content import seed_content


def _current_week_str() -> str:
    """Return current week start (Monday) as YYYY-MM-DD."""
    from datetime import datetime, timedelta

    today = datetime.utcnow().date()
    monday = today - timedelta(days=today.weekday())
    return monday.isoformat()


def seed_user(session: Session, username: str) -> User:
    """Get or create the default learner, seeding gamification tables if absent."""
    user = session.execute(select(User).where(User.username == username)).scalar_one_or_none()
    if user is None:
        user = User(username=username, total_xp=0, gems=0)
        session.add(user)
        session.flush()

        session.add(Streak(user_id=user.id))
        session.add(Hearts(user_id=user.id))

    daily = session.execute(
        select(DailyGoal).where(DailyGoal.user_id == user.id)
    ).scalar_one_or_none()
    if daily is None:
        daily = DailyGoal(user_id=user.id, target_xp=50, xp_today=0)
        session.add(daily)

    week_str = _current_week_str()
    if session.execute(
        select(LeaderboardEntry).where(
            LeaderboardEntry.user_id == user.id,
            LeaderboardEntry.week_start == week_str,
        )
    ).scalar_one_or_none() is None:
        session.add(LeaderboardEntry(user_id=user.id, weekly_xp=0, week_start=week_str))

    existing_ach_keys = {
        row for row in session.execute(
            select(Achievement.key).where(Achievement.user_id == user.id)
        ).scalars().all()
    }
    for ach_data in DEFAULT_ACHIEVEMENTS:
        if ach_data["key"] not in existing_ach_keys:
            session.add(Achievement(user_id=user.id, **ach_data))

    return user


def seed_leaderboard_rivals(session: Session) -> None:
    """Seed rival learners + their current-week leaderboard entries. Idempotent."""
    week_str = _current_week_str()
    for rival in LEADERBOARD_RIVALS:
        user = session.execute(
            select(User).where(User.username == rival["username"])
        ).scalar_one_or_none()
        if user is None:
            user = User(
                username=rival["username"],
                total_xp=rival["weekly_xp"],
                gems=rival["weekly_xp"] // 10,
            )
            session.add(user)
            session.flush()

        entry = session.execute(
            select(LeaderboardEntry).where(
                LeaderboardEntry.user_id == user.id,
                LeaderboardEntry.week_start == week_str,
            )
        ).scalar_one_or_none()
        if entry is None:
            session.add(
                LeaderboardEntry(
                    user_id=user.id, weekly_xp=rival["weekly_xp"], week_start=week_str
                )
            )


def run_seed(session: Session) -> None:
    """Seed course content + default user. Idempotent."""
    seed_content(session)
    from app.core.config import settings

    seed_user(session, settings.default_username)
    seed_leaderboard_rivals(session)
    session.flush()
    session.commit()