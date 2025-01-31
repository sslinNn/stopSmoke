from sqlalchemy import select, or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.User import User


async def existing_user(db: AsyncSession, email: str = None, username: str = None):
    """Проверяет существование пользователя по email или username."""
    if not email and not username:
        return None

    stmt = select(User).where(or_(User.email == email, User.username == username))

    try:
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return None
