"""Course content seeding: units, skills, lessons, and exercises."""

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.data.exercises import DEFAULT_EXERCISES, SKILL_EXERCISES, UNITS
from app.models.course import Course, Exercise, Lesson, Skill, Unit


def seed_content(session: Session) -> Course:
    """Create the Hindi course if absent; return the active course."""
    existing = session.execute(
        select(Course).where(Course.lang_target == "hi")
    ).scalar_one_or_none()

    if existing:
        course = existing
    else:
        course = Course(
            title="Hindi",
            lang_source="en",
            lang_target="hi",
        )
        session.add(course)
        session.flush()

        for u_order, unit_data in enumerate(UNITS):
            unit = Unit(
                course_id=course.id,
                title=unit_data["title"],
                description=unit_data["description"],
                sort_order=u_order,
            )
            session.add(unit)
            session.flush()

            for s_order, skill_data in enumerate(unit_data["skills"]):
                skill = Skill(
                    unit_id=unit.id,
                    title=skill_data["title"],
                    description=skill_data.get("description"),
                    sort_order=s_order,
                )
                session.add(skill)
                session.flush()

                lesson = Lesson(
                    skill_id=skill.id,
                    title=f"{skill.title} \u2014 Lesson 1",
                    sort_order=0,
                    xp_reward=10,
                )
                session.add(lesson)
                session.flush()

    _seed_exercises(session, course)
    return course


def _seed_exercises(session: Session, course: Course) -> None:
    """Create exercises for any lesson that has none yet."""
    all_lessons = session.execute(
        select(Lesson)
        .join(Skill)
        .join(Unit)
        .where(Unit.course_id == course.id)
    ).scalars().all()

    for lesson in all_lessons:
        has_exercises = session.execute(
            select(Exercise).where(Exercise.lesson_id == lesson.id)
        ).scalars().first()
        if has_exercises:
            continue

        skill = session.get(Skill, lesson.skill_id)
        skill_title = skill.title if skill else ""
        templates = SKILL_EXERCISES.get(skill_title, DEFAULT_EXERCISES)
        for idx, ex_data in enumerate(templates):
            ex_type = ex_data.get("type", "multiple_choice")
            exercise = Exercise(
                lesson_id=lesson.id,
                exercise_type=ex_type,
                exercise_data=json.dumps(ex_data),
                sort_order=idx,
            )
            session.add(exercise)