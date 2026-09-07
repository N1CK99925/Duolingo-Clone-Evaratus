"""HTTP routers for user, path, and health endpoints (VS1)."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.path import ChestClaimResponse, HealthResponse, PathResponse, UserSummary
from app.services import path as path_service
from app.services.chest import claim_chest
from app.services.user import get_default_user

router = APIRouter(tags=["core"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", app="duolingo-backend")


@router.get("/api/me", response_model=UserSummary)
def me(db: DbSession) -> UserSummary:
    try:
        return path_service.get_user_summary(db)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/api/path", response_model=PathResponse)
def path(db: DbSession) -> PathResponse:
    try:
        return path_service.get_path(db)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/api/path/chests/{unit_id}/claim", response_model=ChestClaimResponse)
def claim_chest_endpoint(unit_id: int, db: DbSession) -> ChestClaimResponse:
    """Claim the unit's path chest for the default user, awarding gems once."""
    try:
        user = get_default_user(db)
        reward, gems = claim_chest(db, user, unit_id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    return ChestClaimResponse(reward=reward, gems=gems)
