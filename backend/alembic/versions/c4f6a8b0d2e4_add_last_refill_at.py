"""VS5: add hearts.last_refill_at for time-based heart regeneration.

Revision ID: c4f6a8b0d2e4
Revises: b2d4f6a8c0e1
Create Date: 2026-09-07 20:30:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c4f6a8b0d2e4"
down_revision: str | Sequence[str] | None = "b2d4f6a8c0e1"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("hearts", sa.Column("last_refill_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("hearts", "last_refill_at")
