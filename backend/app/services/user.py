"""Shared user lookup used across multiple service modules."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


def get_default_user(db: Session) -> User:
    """Return the default learner (seeded). Raises LookupError if absent."""
    from app.core.config import settings

    user = db.execute(
        select(User).where(User.username == settings.default_username)
    ).scalar_one_or_none()
    if user is None:
        raise LookupError("Default learner not found. Run seed first.")
    return user
