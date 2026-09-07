"""HTTP routers for user, path, and health endpoints (VS1)."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.path import HealthResponse, PathResponse, UserSummary
from app.services import path as path_service

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
