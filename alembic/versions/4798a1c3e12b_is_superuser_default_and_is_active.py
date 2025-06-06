"""is_superuser default and is_active

Revision ID: 4798a1c3e12b
Revises: f39a96c4d2b4
Create Date: 2025-02-17 18:38:39.037003

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4798a1c3e12b'
down_revision: Union[str, None] = 'f39a96c4d2b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'is_active',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    op.alter_column('users', 'is_superuser',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'is_superuser',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    op.alter_column('users', 'is_active',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    # ### end Alembic commands ###
