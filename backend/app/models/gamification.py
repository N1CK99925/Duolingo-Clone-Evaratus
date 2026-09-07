"""Gamification ORM models: streaks, hearts, daily goals, achievements, leaderboard."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Streak(Base):
    __tablename__ = "streaks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    current_streak: Mapped[int] = mapped_column(Integer, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0)
    # YYYY-MM-DD string of the last practice day; used to detect today/yesterday/gap.
    last_practice_date: Mapped[str | None] = mapped_column(String)


class Hearts(Base):
    __tablename__ = "hearts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    current_hearts: Mapped[int] = mapped_column(Integer, default=5)
    max_hearts: Mapped[int] = mapped_column(Integer, default=5)
    # Start of the current 30-minute regen window; NULL while hearts are full.
    last_refill_at: Mapped[datetime | None] = mapped_column(DateTime)


class DailyGoal(Base):
    """Daily XP goal tracking for the profile page."""

    __tablename__ = "daily_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    target_xp: Mapped[int] = mapped_column(Integer, default=50)
    xp_today: Mapped[int] = mapped_column(Integer, default=0)
    # YYYY-MM-DD string; xp_today resets when the date rolls over.
    last_practice_date: Mapped[str | None] = mapped_column(String)


class Achievement(Base):
    """Unlockable achievements shown on the profile page."""

    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    key: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    icon: Mapped[str] = mapped_column(String, default="🏆")
    goal: Mapped[int] = mapped_column(Integer, default=1)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    unlocked_at: Mapped[datetime | None] = mapped_column(DateTime)

    __table_args__ = (UniqueConstraint("user_id", "key", name="uq_user_key"),)


class ChestClaim(Base):
    """One-time path chest claim (gems) per unit for a user."""

    __tablename__ = "chest_claims"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id", ondelete="CASCADE"))
    claimed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id", "unit_id", name="uq_user_unit_chest"),)


class LeaderboardEntry(Base):
    """Weekly leaderboard snapshot (league standings)."""

    __tablename__ = "leaderboard_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    weekly_xp: Mapped[int] = mapped_column(Integer, default=0)
    week_start: Mapped[str] = mapped_column(String, nullable=False)
