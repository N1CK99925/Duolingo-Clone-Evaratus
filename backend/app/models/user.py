"""User and user-progress ORM models."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    # Kept: the profile page shows the "Joined <date>" line from this column.
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Denormalized gamification counters (updated by the API on each event).
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    gems: Mapped[int] = mapped_column(Integer, default=0)

    progress: Mapped[list["UserProgress"]] = relationship(back_populates="user")


class UserProgress(Base):
    """One row per completed lesson. Skill progress is derived by counting rows."""

    __tablename__ = "user_progress"
    __table_args__ = ({"sqlite_autoincrement": True},)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    # Denormalized so progress queries don't need a lesson -> skill join.
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"))
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id", ondelete="CASCADE"))
    is_completed: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship(back_populates="progress")
