"""Lesson detail fetching: lesson metadata and ordered exercises."""

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Exercise, Lesson, Skill
from app.schemas.lesson import ExerciseDetail, LessonDetail


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
                exercise_data=ex_data,
            )
        )

    return LessonDetail(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        sort_order=lesson.sort_order,
        xp_reward=lesson.xp_reward,
        skill_title=skill.title if skill else "",
        exercises=exercise_details,
    )
