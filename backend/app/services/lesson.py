"""Service functions for lesson player, exercise submission, and completion (VS2)."""

import json
from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.course import Exercise, Lesson, Skill
from app.models.gamification import ExerciseResponse, Hearts, Streak, XpLog
from app.models.user import User, UserProgress
from app.schemas.lesson import (
    AnswerSubmitResponse,
    ExerciseDetail,
    LessonCompleteResponse,
    LessonDetail,
)
from app.services.path import get_default_user


def get_lesson_detail(db: Session, lesson_id: int) -> LessonDetail:
    """Return lesson details with ordered exercises."""
    lesson = db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    ).scalar_one_or_none()
    if lesson is None:
        raise LookupError(f"Lesson {lesson_id} not found.")

    skill = db.execute(select(Skill).where(Skill.id == lesson.skill_id)).scalar_one_or_none()

    exercises_orm = (
        db.execute(
            select(Exercise)
            .where(Exercise.lesson_id == lesson_id)
            .order_by(Exercise.sort_order, Exercise.id)
        )
        .scalars()
        .all()
    )

    exercise_details: list[ExerciseDetail] = []
    for ex in exercises_orm:
        try:
            ex_data = json.loads(ex.exercise_data)
        except Exception:
            ex_data = {}

        exercise_details.append(
            ExerciseDetail(
                id=ex.id,
                lesson_id=ex.lesson_id,
                exercise_type=ex.exercise_type,
                sort_order=ex.sort_order,
                difficulty=ex.difficulty,
                exercise_data=ex_data,
            )
        )

    return LessonDetail(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        sort_order=lesson.sort_order,
        xp_reward=lesson.xp_reward,
        is_hard=lesson.is_hard,
        skill_title=skill.title if skill else "",
        skill_color=skill.skill_color if skill else "#58CC02",
        exercises=exercise_details,
    )


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

    hearts = db.execute(select(Hearts).where(Hearts.user_id == user_id)).scalar_one_or_none()
    if hearts is None:
        hearts = Hearts(user_id=user_id, current_hearts=5, max_hearts=5)
        db.add(hearts)
        db.flush()

    try:
        data = json.loads(exercise.exercise_data)
    except Exception:
        data = {}

    correct_index = data.get("correct_index", 0)
    choices = data.get("choices", [])
    explanation = data.get("explanation")

    is_correct = False

    # Check choice index (as int or numeric string)
    str_ans = str(user_answer).strip()
    if str_ans.isdigit() and int(str_ans) == correct_index:
        is_correct = True
    elif choices and 0 <= correct_index < len(choices):
        correct_choice_text = choices[correct_index]
        if str_ans.lower() == str(correct_choice_text).lower():
            is_correct = True

    if not is_correct:
        hearts.current_hearts = max(0, hearts.current_hearts - 1)
        hearts.updated_at = datetime.utcnow()

    response = ExerciseResponse(
        user_id=user_id,
        exercise_id=exercise_id,
        lesson_id=lesson_id,
        is_correct=1 if is_correct else 0,
        user_answer=str(user_answer),
        time_spent_ms=time_spent_ms,
        created_at=datetime.utcnow(),
    )
    db.add(response)
    db.commit()
    db.refresh(hearts)

    return AnswerSubmitResponse(
        is_correct=is_correct,
        correct_answer=correct_index,
        explanation=explanation,
        current_hearts=hearts.current_hearts,
        max_hearts=hearts.max_hearts,
        is_out_of_hearts=hearts.current_hearts <= 0,
    )


def complete_lesson(db: Session, user_id: int, lesson_id: int) -> LessonCompleteResponse:
    """Award XP, update user progress, update streak on lesson completion."""
    lesson = db.execute(select(Lesson).where(Lesson.id == lesson_id)).scalar_one_or_none()
    if lesson is None:
        raise LookupError(f"Lesson {lesson_id} not found.")

    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise LookupError(f"User {user_id} not found.")

    hearts = db.execute(select(Hearts).where(Hearts.user_id == user_id)).scalar_one_or_none()
    if hearts and hearts.current_hearts <= 0:
        raise ValueError("Cannot complete lesson when out of hearts.")

    # 1. Award XP
    xp_amount = lesson.xp_reward
    user.total_xp += xp_amount
    db.add(XpLog(user_id=user.id, amount=xp_amount, source="lesson_complete"))

    # 2. Update per-lesson progress
    existing_progress = db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.skill_id == lesson.skill_id,
            UserProgress.lesson_id == lesson_id,
        )
    ).scalar_one_or_none()

    now = datetime.utcnow()
    if not existing_progress:
        db.add(
            UserProgress(
                user_id=user_id,
                skill_id=lesson.skill_id,
                lesson_id=lesson_id,
                is_completed=1,
                lessons_completed=1,
                last_practiced=now,
                created_at=now,
                updated_at=now,
            )
        )
    else:
        existing_progress.is_completed = 1
        existing_progress.last_practiced = now
        existing_progress.updated_at = now

    # Check if skill completed
    total_lessons_in_skill = db.execute(
        select(func.count(Lesson.id)).where(Lesson.skill_id == lesson.skill_id)
    ).scalar_one()

    completed_lessons_count = db.execute(
        select(func.count(UserProgress.id)).where(
            UserProgress.user_id == user_id,
            UserProgress.skill_id == lesson.skill_id,
            UserProgress.lesson_id.is_not(None),
            UserProgress.is_completed == 1,
        )
    ).scalar_one()

    skill_completed = completed_lessons_count >= total_lessons_in_skill

    # Skill-aggregate progress row update
    skill_aggregate = db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.skill_id == lesson.skill_id,
            UserProgress.lesson_id.is_(None),
        )
    ).scalar_one_or_none()

    if not skill_aggregate:
        skill_aggregate = UserProgress(
            user_id=user_id,
            skill_id=lesson.skill_id,
            lesson_id=None,
            lessons_completed=completed_lessons_count,
            is_completed=1 if skill_completed else 0,
            crown_level=1 if skill_completed else 0,
            last_practiced=now,
            created_at=now,
            updated_at=now,
        )
        db.add(skill_aggregate)
    else:
        skill_aggregate.lessons_completed = completed_lessons_count
        if skill_completed:
            skill_aggregate.is_completed = 1
            if skill_aggregate.crown_level == 0:
                skill_aggregate.crown_level = 1
        skill_aggregate.last_practiced = now
        skill_aggregate.updated_at = now

    # 3. Update Streak
    streak = db.execute(select(Streak).where(Streak.user_id == user_id)).scalar_one_or_none()
    if not streak:
        streak = Streak(user_id=user_id)
        db.add(streak)

    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    if streak.last_practice_date == today_str:
        pass  # already logged today
    elif streak.last_practice_date == yesterday_str:
        streak.current_streak += 1
        streak.last_practice_date = today_str
    else:
        streak.current_streak = 1
        streak.last_practice_date = today_str

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak
    streak.updated_at = now

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
