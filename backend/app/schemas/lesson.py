"""Pydantic schemas for lesson player endpoints (VS2)."""

from typing import Any

from pydantic import BaseModel, ConfigDict


class ExerciseDetail(BaseModel):
    """Exercise detail as exposed to the lesson player frontend."""

    id: int
    lesson_id: int
    exercise_type: str
    sort_order: int
    exercise_data: dict[str, Any]

    model_config = ConfigDict(from_attributes=True)


class LessonDetail(BaseModel):
    """Lesson details including skill metadata and ordered exercises."""

    id: int
    skill_id: int
    title: str
    sort_order: int
    xp_reward: int
    skill_title: str
    exercises: list[ExerciseDetail]

    model_config = ConfigDict(from_attributes=True)


class AnswerSubmitRequest(BaseModel):
    """Payload for submitting an answer to an exercise."""

    user_answer: Any
    time_spent_ms: int | None = None


class AnswerSubmitResponse(BaseModel):
    """Feedback returned after answering an exercise."""

    is_correct: bool
    correct_answer: str | int
    explanation: str | None = None
    current_hearts: int
    max_hearts: int
    is_out_of_hearts: bool


class LessonCompleteResponse(BaseModel):
    """Summary returned after completing a lesson."""

    xp_awarded: int
    total_xp: int
    current_streak: int
    current_hearts: int
    max_hearts: int
    skill_completed: bool
