"""HTTP routers for leaderboard and profile endpoints (VS4)."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.gamification import (
    DailyGoalUpdate,
    HeartsStatusResponse,
    LeaderboardEntryResponse,
    ProfileResponse,
    SettingsResponse,
)
from app.services.gamification import (
    get_default_user,
    get_hearts_status,
    get_leaderboard,
    get_profile,
    mark_current_user_in_leaderboard,
    refill_hearts,
    set_daily_goal,
)

router = APIRouter(tags=["gamification"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/api/leaderboard", response_model=list[LeaderboardEntryResponse])
def leaderboard(db: DbSession) -> list[LeaderboardEntryResponse]:
    """Return this week's leaderboard standings."""
    try:
        user = get_default_user(db)
        entries = get_leaderboard(db)
        entries = mark_current_user_in_leaderboard(entries, user.id)
        return [LeaderboardEntryResponse.model_validate(e) for e in entries]
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/api/profile", response_model=ProfileResponse)
def profile(db: DbSession) -> ProfileResponse:
    """Return the current user's profile with XP, streak, gems, achievements."""
    try:
        user = get_default_user(db)
        return ProfileResponse.model_validate(get_profile(db, user))
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.patch("/api/profile/daily-goal", response_model=ProfileResponse)
def update_daily_goal(payload: DailyGoalUpdate, db: DbSession) -> ProfileResponse:
    """Set the current learner's daily XP goal and return the updated profile."""
    try:
        user = get_default_user(db)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    set_daily_goal(db, user.id, payload.target_xp)
    db.commit()
    return ProfileResponse.model_validate(get_profile(db, user))


# --- VS5: hearts lifecycle ---------------------------------------------------


@router.get("/api/me/hearts", response_model=HeartsStatusResponse)
def my_hearts(db: DbSession) -> HeartsStatusResponse:
    """Current hearts plus the next time-based refill timestamp."""
    try:
        user = get_default_user(db)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return HeartsStatusResponse.model_validate(get_hearts_status(db, user.id))


@router.post("/api/me/hearts/refill", response_model=HeartsStatusResponse)
def refill_my_hearts(db: DbSession) -> HeartsStatusResponse:
    """Refill hearts to max by spending gems (mock purchase)."""
    try:
        user = get_default_user(db)
        return HeartsStatusResponse.model_validate(refill_hearts(db, user.id))
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


# --- VS5: settings placeholders ----------------------------------------------


@router.get("/api/settings", response_model=SettingsResponse)
def get_settings() -> SettingsResponse:
    """Placeholder settings payload — no real logic yet."""
    return SettingsResponse()


@router.patch("/api/settings", response_model=SettingsResponse)
def update_settings() -> SettingsResponse:
    """Placeholder settings update — accepted and ignored."""
    return SettingsResponse()
