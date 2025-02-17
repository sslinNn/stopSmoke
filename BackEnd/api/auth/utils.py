from datetime import timedelta

from fastapi_users import password
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy, CookieTransport
from sqlalchemy.ext.asyncio import AsyncSession

from backend import config
from backend.config import get_secret_key
from backend.models.User import User
from backend.schemas.UserSchema import SUserRegister
from sqlalchemy.future import select
from fastapi import HTTPException

from backend.utils.EmailUtils import create_username_by_email
from backend.utils.PasswordUtils import get_password_hash


# @router.post("/register")
async def create_user(db: AsyncSession, user: SUserRegister):

    if user.password != user.password_repeat:
        raise HTTPException(status_code=400, detail="Passwords don't match")

    # Проверяем, есть ли пользователь с таким email
    existing_user = await db.execute(select(User).where(User.email == user.email))
    existing_user = existing_user.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=400, detail="User with this email already exists"
        )

    # Если email уникален, создаём нового пользователя
    current_user = User(
        email=user.email,
        password=get_password_hash(user.password),
        username=create_username_by_email(user.email),
    )
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user


