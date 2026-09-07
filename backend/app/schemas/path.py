"""Pydantic schemas for user and path endpoints (VS1)."""

from pydantic import BaseModel, ConfigDict


class UserSummary(BaseModel):
    """Top-bar / profile summary for the default learner."""

    id: int
    username: str
    total_xp: int
    gems: int
    streak: int
    hearts: int
    max_hearts: int

    model_config = ConfigDict(from_attributes=True)


class SkillNode(BaseModel):
    """A single skill node on the learning path with its progress state."""

    id: int
    title: str
    description: str | None
    icon: str | None
    sort_order: int
    color: str
    # Derived state for the path UI.
    state: str  # locked | active | completed | available
    crown_level: int
    lessons_completed: int
    lesson_count: int
    # First lesson in the skill (VS2: the lesson the path opens on click).
    first_lesson_id: int | None = None


class UnitNode(BaseModel):
    """A unit banner and its skills."""

    id: int
    title: str
    description: str | None
    sort_order: int
    skills: list[SkillNode]


class PathResponse(BaseModel):
    """The learning path: ordered units containing skills with progress."""

    course_id: int
    course_title: str
    units: list[UnitNode]


class HealthResponse(BaseModel):
    status: str
    app: str
