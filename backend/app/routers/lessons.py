"""HTTP routers for lesson player endpoints (VS2)."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.lesson import (
    AnswerSubmitRequest,
    AnswerSubmitResponse,
    LessonCompleteResponse,
    LessonDetail,
)
from app.services import lesson as lesson_service
from app.services.path import get_default_user

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/{id}", response_model=LessonDetail)
def get_lesson(id: int, db: DbSession) -> LessonDetail:
    """Get lesson detail including ordered exercises."""
    try:
        return lesson_service.get_lesson_detail(db, lesson_id=id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{id}/exercises/{exercise_id}/answer", response_model=AnswerSubmitResponse)
def submit_answer(
    id: int,
    exercise_id: int,
    payload: AnswerSubmitRequest,
    db: DbSession,
) -> AnswerSubmitResponse:
    """Submit answer for an exercise within a lesson."""
    try:
        user = get_default_user(db)
        return lesson_service.submit_exercise_answer(
            db=db,
            user_id=user.id,
            lesson_id=id,
            exercise_id=exercise_id,
            user_answer=payload.user_answer,
            time_spent_ms=payload.time_spent_ms,
        )
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(id: int, db: DbSession) -> LessonCompleteResponse:
    """Mark a lesson as completed, award XP, and update progress/streak."""
    try:
        user = get_default_user(db)
        return lesson_service.complete_lesson(db=db, user_id=user.id, lesson_id=id)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
