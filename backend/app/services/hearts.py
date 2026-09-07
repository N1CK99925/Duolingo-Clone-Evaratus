"""Hearts lifecycle: creation, time-based regen, status, and gem refill."""

from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.gamification import Hearts
from app.models.user import User

HEART_REGEN_MINUTES = 30
HEART_REFILL_COST_GEMS = 350


def get_or_create_hearts(db: Session, user_id: int) -> Hearts:
    """Return the user's hearts row, creating it if absent."""
    hearts = db.execute(select(Hearts).where(Hearts.user_id == user_id)).scalar_one_or_none()
    if hearts is None:
        hearts = Hearts(user_id=user_id)
        db.add(hearts)
        db.flush()
    return hearts


def regen_hearts(db: Session, hearts: Hearts, now: datetime | None = None) -> Hearts:
    """Regenerate 1 heart per HEART_REGEN_MINUTES elapsed, capped at max.

    `last_refill_at` anchors the current regen window; it is NULL while hearts
    are full so the timer restarts on the next drain.
    """
    now = now or datetime.utcnow()
    if hearts.current_hearts >= hearts.max_hearts:
        hearts.last_refill_at = None
        return hearts
    if hearts.last_refill_at is None:
        hearts.last_refill_at = now
        return hearts

    window = HEART_REGEN_MINUTES * 60
    gained = int((now - hearts.last_refill_at).total_seconds() // window)
    if gained > 0:
        hearts.current_hearts = min(hearts.max_hearts, hearts.current_hearts + gained)
        if hearts.current_hearts >= hearts.max_hearts:
            hearts.last_refill_at = None
        else:
            hearts.last_refill_at += timedelta(minutes=HEART_REGEN_MINUTES * gained)
    return hearts


def get_hearts_status(db: Session, user_id: int) -> dict[str, Any]:
    """Return current/max hearts, next refill timestamp, and out-of-hearts flag."""
    hearts = get_or_create_hearts(db, user_id)
    regen_hearts(db, hearts)
    db.commit()

    next_refill_at = None
    if hearts.current_hearts < hearts.max_hearts:
        base = hearts.last_refill_at or datetime.utcnow()
        next_refill_at = (base + timedelta(minutes=HEART_REGEN_MINUTES)).isoformat()

    return {
        "current_hearts": hearts.current_hearts,
        "max_hearts": hearts.max_hearts,
        "next_refill_at": next_refill_at,
        "is_out_of_hearts": hearts.current_hearts <= 0,
    }


def refill_hearts(db: Session, user_id: int) -> dict[str, Any]:
    """Refill hearts to max by spending gems (mock purchase)."""
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise LookupError(f"User {user_id} not found.")

    hearts = get_or_create_hearts(db, user_id)
    if hearts.current_hearts >= hearts.max_hearts:
        raise ValueError("Hearts are already full.")
    if user.gems < HEART_REFILL_COST_GEMS:
        raise ValueError(f"Not enough gems: refill costs {HEART_REFILL_COST_GEMS}.")

    user.gems -= HEART_REFILL_COST_GEMS
    hearts.current_hearts = hearts.max_hearts
    hearts.last_refill_at = None
    db.commit()
    return get_hearts_status(db, user_id)
