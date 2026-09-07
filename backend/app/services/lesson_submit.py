"""Lesson answer submission and completion logic."""

import json
from datetime import datetime
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.course import Exercise, Lesson
from app.models.user import User, UserProgress
from app.schemas.lesson import AnswerSubmitResponse, LessonCompleteResponse
from app.services.achievements import update_achievements
from app.services.daily_goal import record_daily_xp
from app.services.hearts import get_or_create_hearts, regen_hearts
from app.services.leaderboard import add_weekly_xp
from app.services.lesson_check import check_answer
from app.services.streak import update_streak


def submit_exercise_answer(
    db: Session,
    user_id: int,
    lesson_id: int,
    exercise_id: int,
    user_answer: Any,
    time_spent_ms: int | None = None,
) -> AnswerSubmitResponse:
    """Validate exercise answer, record response, and decrement hearts if incorrect."""
    exercise = db.execute(
        select(Exercise).where(Exercise.id == exercise_id, Exercise.lesson_id == lesson_id)
    ).scalar_one_or_none()

    if exercise is None:
        raise LookupError(f"Exercise {exercise_id} not found for lesson {lesson_id}.")

    hearts = get_or_create_hearts(db, user_id)
    regen_hearts(db, hearts)

    try:
        data = json.loads(exercise.exercise_data)
    except Exception:
        data = {}

    explanation = data.get("explanation")
    is_correct = check_answer(exercise.exercise_type, data, user_answer)

    # Feed the concrete correct answer back for text-based exercise types.
    correct_answer: str | int = data.get("correct_index", 0)
    if exercise.exercise_type == "tap_words":
        correct = data.get("correct") or []
        joined = " ".join(str(word) for word in correct) if isinstance(correct, list) else correct
        correct_answer = str(joined)
    elif exercise.exercise_type == "type_answer":
        accepted = data.get("correct") or []
        if isinstance(accepted, str):
            accepted = [accepted]
        correct_answer = str(accepted[0]) if accepted else ""

    if not is_correct and not settings.infinite_hearts:
        hearts.current_hearts = max(0, hearts.current_hearts - 1)

    db.commit()
    db.refresh(hearts)

    return AnswerSubmitResponse(
        is_correct=is_correct,
        correct_answer=correct_answer,
        explanation=explanation,
        current_hearts=hearts.current_hearts,
        max_hearts=hearts.max_hearts,
        is_out_of_hearts=hearts.current_hearts <= 0 and not settings.infinite_hearts,
    )


def complete_lesson(db: Session, user_id: int, lesson_id: int) -> LessonCompleteResponse:
    """Award XP, update user progress, update streak on lesson completion."""
    lesson = db.execute(select(Lesson).where(Lesson.id == lesson_id)).scalar_one_or_none()
    if lesson is None:
        raise LookupError(f"Lesson {lesson_id} not found.")

    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise LookupError(f"User {user_id} not found.")

    hearts = get_or_create_hearts(db, user_id)
    regen_hearts(db, hearts)
    if hearts.current_hearts <= 0:
        raise ValueError("Cannot complete lesson when out of hearts.")

    xp_amount = lesson.xp_reward
    user.total_xp += xp_amount
    add_weekly_xp(db, user_id, xp_amount)

    existing_progress = db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.lesson_id == lesson_id,
        )
    ).scalar_one_or_none()

    if not existing_progress:
        db.add(
            UserProgress(
                user_id=user_id,
                skill_id=lesson.skill_id,
                lesson_id=lesson_id,
                is_completed=1,
            )
        )

    db.flush()

    total_lessons_in_skill = db.execute(
        select(func.count(Lesson.id)).where(Lesson.skill_id == lesson.skill_id)
    ).scalar_one()

    completed_lessons_count = db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user_id,
            UserProgress.skill_id == lesson.skill_id,
            UserProgress.is_completed == 1,
        )
    ).scalar_one()

    skill_completed = completed_lessons_count >= total_lessons_in_skill

    now = datetime.utcnow()
    streak = update_streak(db, user_id, now)
    record_daily_xp(db, user_id, xp_amount, now)
    update_achievements(db, user, now)

    db.commit()
    db.refresh(user)

    return LessonCompleteResponse(
        xp_awarded=xp_amount,
        total_xp=user.total_xp,
        current_streak=streak.current_streak,
        current_hearts=hearts.current_hearts if hearts else 5,
        max_hearts=hearts.max_hearts if hearts else 5,
        skill_completed=skill_completed,
    )
