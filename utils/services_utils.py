from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.User import User

async def user_existing_by_email(email: EmailStr, db: AsyncSession) -> User:
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def user_existing_by_id(user_id: int, db: AsyncSession) -> User:
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

def create_username_by_email(email: str) -> str:
    return email.split("@")[0]
