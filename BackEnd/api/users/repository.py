from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models import User

async def get_users(db: AsyncSession):
    result = await db.execute(select(User.User))
    return result.scalars().all()


async def create_user(db: AsyncSession, user_data: User):
    try:
        user = User.User(**user_data)
        user.username = user.email.split('@')[0]
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    except SQLAlchemyError:
        await db.rollback()
        raise
