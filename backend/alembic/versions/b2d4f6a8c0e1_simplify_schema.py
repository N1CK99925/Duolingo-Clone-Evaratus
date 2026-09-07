"""Simplify schema: drop unused tables and columns (see docs/database-schema.md).

- Drop write-only tables: xp_log, exercise_responses.
- Drop never-read columns (course subtitle/is_active, unit/skill is_locked,
  skill_color, lesson is_hard, exercise difficulty, user avatar_url,
  progress aggregate columns, unused created_at/updated_at/last_refill_at).
- user_progress keeps only per-lesson completion rows.

Revision ID: b2d4f6a8c0e1
Revises: 1f3a2b4c5d6e
Create Date: 2026-09-07 19:30:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b2d4f6a8c0e1"
down_revision: str | Sequence[str] | None = "1f3a2b4c5d6e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _drop_columns(table_name: str, columns: list[str], **table_kwargs) -> None:
    """Drop columns via SQLite batch mode (table recreate; data is preserved).

    Column existence is checked first so the migration can be re-run safely:
    SQLite batch DDL is non-transactional, so a partial failure must not
    block a retry.
    """
    existing = {c["name"] for c in sa.inspect(op.get_bind()).get_columns(table_name)}
    to_drop = [c for c in columns if c in existing]
    if not to_drop:
        return
    with op.batch_alter_table(table_name, **table_kwargs) as batch:
        for col in to_drop:
            batch.drop_column(col)


def _table_exists(name: str) -> bool:
    return bool(
        op.get_bind()
        .execute(
            sa.text("SELECT 1 FROM sqlite_master WHERE type='table' AND name=:n"),
            {"n": name},
        )
        .scalar()
    )


def _index_exists(name: str) -> bool:
    return bool(
        op.get_bind()
        .execute(
            sa.text("SELECT 1 FROM sqlite_master WHERE type='index' AND name=:n"),
            {"n": name},
        )
        .scalar()
    )


def upgrade() -> None:
    # Write-only log tables: written on every answer/lesson-complete, never read.
    if _index_exists("idx_responses_lesson"):
        op.drop_index("idx_responses_lesson", table_name="exercise_responses")
    if _index_exists("idx_responses_exercise"):
        op.drop_index("idx_responses_exercise", table_name="exercise_responses")
    if _index_exists("idx_responses_user"):
        op.drop_index("idx_responses_user", table_name="exercise_responses")
    if _table_exists("exercise_responses"):
        op.drop_table("exercise_responses")
    if _table_exists("xp_log"):
        op.drop_table("xp_log")

    _drop_columns("courses", ["subtitle", "is_active"])
    _drop_columns("units", ["is_locked"])
    _drop_columns("skills", ["skill_color", "is_locked"])
    _drop_columns("lessons", ["is_hard"])
    _drop_columns("exercises", ["difficulty"])
    _drop_columns("users", ["avatar_url"])
    # Per-lesson completion rows only: skill progress is derived by counting rows.
    # Remove legacy write-only skill-aggregate rows (lesson_id IS NULL) first.
    if _table_exists("user_progress"):
        op.execute("DELETE FROM user_progress WHERE lesson_id IS NULL")
    _drop_columns(
        "user_progress",
        ["crown_level", "lessons_completed", "last_practiced", "created_at", "updated_at"],
        reflect_kwargs={"sqlite_autoincrement": True},
    )
    _drop_columns("streaks", ["created_at", "updated_at"])
    _drop_columns("hearts", ["last_refill_at", "updated_at"])
    _drop_columns("daily_goals", ["created_at", "updated_at"])
    _drop_columns("achievements", ["created_at"])
    _drop_columns("leaderboard_entries", ["created_at"])


def downgrade() -> None:
    # Not supported: dropping data (xp_log / exercise_responses rows) is irreversible.
    raise NotImplementedError("Simplify-schema migration is not reversible.")
