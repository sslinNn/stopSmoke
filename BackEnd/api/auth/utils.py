from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.User import User
from backend.schemas.UserSchema import SUserRegister, SUserLogin
from sqlalchemy.future import select
from fastapi import HTTPException

from backend.utils.EmailUtils import create_username_by_email
from backend.utils.JWTUtils import create_access_token
from backend.utils.PasswordUtils import get_password_hash, password_compare


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


# Логин пользователя
async def login_user(db: AsyncSession, user_data: SUserLogin):
    user = await db.execute(select(User).where(User.email == user_data.email))
    user = user.scalar_one_or_none()

    if not user or not password_compare(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id)})
    return token


