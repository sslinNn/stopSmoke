import bcrypt
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.User import User
from backend.schemas.UserSchema import SUserRegister


def password_hash(password) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def password_compare(password1, password2) -> bool:
    return password1 == password2


async def create_user(db: AsyncSession, user_data: SUserRegister):
    existing_user = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = existing_user.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists.",
        )

    if not password_compare(user_data.password, user_data.password_confirmation):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )
    username = user_data.email.split("@")[0]
    new_user = User(
        username=username,
        email=user_data.email,
        created_at=user_data.created_at,
        password=password_hash(user_data.password),
    )
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists.",
        )
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )