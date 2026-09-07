"""Service functions for the home path and user summary (VS1)."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.course import Course, Lesson, Skill, Unit
from app.models.gamification import Hearts, Streak
from app.models.user import User, UserProgress
from app.schemas.path import PathResponse, SkillNode, UnitNode, UserSummary


def get_default_user(db: Session) -> User:
    """Return the default learner (seeded)."""
    from app.core.config import settings

    user = db.execute(
        select(User).where(User.username == settings.default_username)
    ).scalar_one_or_none()
    if user is None:
        raise LookupError("Default learner not found. Run seed first.")
    return user


def get_user_summary(db: Session) -> UserSummary:
    """Build the top-bar / profile summary for the default user."""
    user = get_default_user(db)
    streak = db.execute(select(Streak).where(Streak.user_id == user.id)).scalar_one_or_none()
    hearts = db.execute(select(Hearts).where(Hearts.user_id == user.id)).scalar_one_or_none()

    return UserSummary(
        id=user.id,
        username=user.username,
        total_xp=user.total_xp,
        gems=user.gems,
        streak=streak.current_streak if streak else 0,
        hearts=hearts.current_hearts if hearts else 0,
        max_hearts=hearts.max_hearts if hearts else 0,
    )


def _progress_by_skill(db: Session, user_id: int) -> dict[int, dict]:
    """Return per-skill lesson completion counts for the user."""
    rows = db.execute(
        select(
            UserProgress.skill_id,
            func.count(UserProgress.id),
        )
        .where(UserProgress.user_id == user_id, UserProgress.lesson_id.is_not(None))
        .group_by(UserProgress.skill_id)
    ).all()
    return {skill_id: {"lessons_completed": count} for skill_id, count in rows}


def get_path(db: Session, stop_at_incomplete: bool = True) -> PathResponse:
    """Build the learning path with per-node state.

    State logic:
      - A skill is `completed` when its lesson count is fully satisfied.
      - The first not-completed skill (in path order) is `active`.
      - Skills at/after the active skill are `locked`.
    """
    user = get_default_user(db)
    course = (
        db.execute(select(Course).where(Course.is_active == 1).order_by(Course.id))
        .scalars()
        .first()
    )
    if course is None:
        raise LookupError("No active course seeded.")

    progress = _progress_by_skill(db, user.id)
    units = (
        db.execute(
            select(Unit).where(Unit.course_id == course.id).order_by(Unit.sort_order, Unit.id)
        )
        .scalars()
        .all()
    )

    unit_nodes: list[UnitNode] = []
    seen_incomplete = False

    for unit in units:
        skills = (
            db.execute(
                select(Skill).where(Skill.unit_id == unit.id).order_by(Skill.sort_order, Skill.id)
            )
            .scalars()
            .all()
        )

        skill_nodes: list[SkillNode] = []
        for skill in skills:
            lesson_count = db.execute(
                select(func.count(Lesson.id)).where(Lesson.skill_id == skill.id)
            ).scalar_one()
            completed = progress.get(skill.id, {}).get("lessons_completed", 0)

            if completed >= lesson_count:
                state = "completed"
            elif not seen_incomplete:
                state = "active"
                seen_incomplete = True
            else:
                state = "locked"

            skill_nodes.append(
                SkillNode(
                    id=skill.id,
                    title=skill.title,
                    description=skill.description,
                    icon=skill.icon,
                    sort_order=skill.sort_order,
                    color=skill.skill_color,
                    state=state,
                    crown_level=2 if completed else 0,  # placeholder crown for completed
                    lessons_completed=completed,
                    lesson_count=lesson_count,
                )
            )

        unit_nodes.append(
            UnitNode(
                id=unit.id,
                title=unit.title,
                description=unit.description,
                sort_order=unit.sort_order,
                skills=skill_nodes,
            )
        )

    return PathResponse(
        course_id=course.id,
        course_title=course.title,
        units=unit_nodes,
    )
