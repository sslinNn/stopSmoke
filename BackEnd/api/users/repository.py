from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.users.utils import existing_user
from backend.models.User import User
from backend.schemas.UserSchema import SUserRegister, SUserLogin
from backend.utils.JWTUtils import create_access_token
from backend.utils.PasswordUtils import get_password_hash, password_compare


async def create_user(db: AsyncSession, user_data: SUserRegister):
    user = await existing_user(db, email=user_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists.",
        )

    if not user_data.password == user_data.password_confirmation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )
    username = user_data.email.split("@")[0]
    new_user = User(
        username=username,
        email=user_data.email,
        created_at=user_data.created_at,
        password=get_password_hash(user_data.password),
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


async def get_user_access_token(db: AsyncSession, user_data: SUserLogin):
    user = await existing_user(db, username=user_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username.",
        )
    if not password_compare(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
        )
    access_token = await create_access_token(
        {
            "sub": user.id,
        }
    )
    return {"access_token": access_token}
