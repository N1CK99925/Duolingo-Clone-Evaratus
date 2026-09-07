"""Pydantic schemas for leaderboard and profile endpoints (VS4)."""

from pydantic import BaseModel, ConfigDict, Field


class LeaderboardEntryResponse(BaseModel):
    """Single leaderboard row returned to the frontend."""

    rank: int
    user_id: int
    username: str
    weekly_xp: int
    is_current_user: bool

    model_config = ConfigDict(from_attributes=True)


class DailyGoalUpdate(BaseModel):
    """Request body for PATCH /api/profile/daily-goal."""

    target_xp: int = Field(ge=10, le=500)


class AchievementResponse(BaseModel):
    """Single achievement shown on the profile page."""

    id: str
    title: str
    description: str
    icon: str
    unlocked: bool
    progress: int
    max_progress: int

    model_config = ConfigDict(from_attributes=True)


class ProfileResponse(BaseModel):
    """Full profile payload returned to /api/profile."""

    username: str
    joined_date: str
    streak: int
    total_xp: int
    gems: int
    daily_goal_xp: int
    today_xp: int
    achievements: list[AchievementResponse]

    model_config = ConfigDict(from_attributes=True)
