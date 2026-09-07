"""vs2 exercises

Revision ID: 6a1f82b7c4d1
Revises: 58cbffa40e69
Create Date: 2026-09-07 18:30:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6a1f82b7c4d1"
down_revision: str | Sequence[str] | None = "58cbffa40e69"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "exercises",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("lesson_id", sa.Integer(), nullable=False),
        sa.Column("exercise_type", sa.String(), nullable=False),
        sa.Column("exercise_data", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("difficulty", sa.Integer(), nullable=False, server_default="1"),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_exercises_lesson", "exercises", ["lesson_id"])

    op.create_table(
        "exercise_responses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("exercise_id", sa.Integer(), nullable=False),
        sa.Column("lesson_id", sa.Integer(), nullable=False),
        sa.Column("is_correct", sa.Integer(), nullable=False),
        sa.Column("user_answer", sa.String(), nullable=True),
        sa.Column("time_spent_ms", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["exercise_id"], ["exercises.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_responses_user", "exercise_responses", ["user_id"])
    op.create_index("idx_responses_exercise", "exercise_responses", ["exercise_id"])
    op.create_index("idx_responses_lesson", "exercise_responses", ["lesson_id"])


def downgrade() -> None:
    op.drop_index("idx_responses_lesson", table_name="exercise_responses")
    op.drop_index("idx_responses_exercise", table_name="exercise_responses")
    op.drop_index("idx_responses_user", table_name="exercise_responses")
    op.drop_table("exercise_responses")
    op.drop_index("idx_exercises_lesson", table_name="exercises")
    op.drop_table("exercises")
