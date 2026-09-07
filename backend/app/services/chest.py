"""Path chest claims: one-time gem reward per unit (Duolingo-style)."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Unit
from app.models.gamification import ChestClaim
from app.models.user import User

CHEST_REWARD = 40


def claimed_unit_ids(db: Session, user_id: int) -> set[int]:
    """Return the unit ids whose chests this user has already claimed."""
    rows = db.execute(
        select(ChestClaim.unit_id).where(ChestClaim.user_id == user_id)
    ).scalars().all()
    return set(rows)


def claim_chest(db: Session, user: User, unit_id: int) -> tuple[int, int]:
    """Award the chest's gems to the user exactly once.

    Raises LookupError for an unknown unit and ValueError for a repeat claim.
    Returns (reward, new gem total).
    """
    if db.execute(select(Unit).where(Unit.id == unit_id)).scalar_one_or_none() is None:
        raise LookupError(f"No unit with id {unit_id}")

    existing = db.execute(
        select(ChestClaim).where(
            ChestClaim.user_id == user.id, ChestClaim.unit_id == unit_id
        )
    ).scalar_one_or_none()

    if existing is not None:
        raise ValueError("Chest already claimed")

    db.add(ChestClaim(user_id=user.id, unit_id=unit_id))
    user.gems += CHEST_REWARD
    db.commit()
    return CHEST_REWARD, user.gems