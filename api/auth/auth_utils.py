from sqlalchemy.ext.asyncio import AsyncSession
from models.User import User
from schemas.UserSchema import SUserRegister, SUserLogin
from sqlalchemy.future import select
from fastapi import HTTPException
import logging
from logging import Logger

from utils.EmailUtils import create_username_by_email
from utils.JWTUtils import create_access_token
from utils.PasswordUtils import get_password_hash, password_compare

logger: Logger = logging.getLogger(__name__)

async def create_user(db: AsyncSession, user: SUserRegister):
    try:
        logger.info(f"Попытка создания пользователя с email: {user.email}")
        
        if user.password != user.password_repeat:
            raise HTTPException(status_code=400, detail="Passwords don't match")

        # Проверяем, есть ли пользователь с таким email
        existing_user = await db.execute(select(User).where(User.email == user.email))
        existing_user = existing_user.scalar_one_or_none()

        if existing_user:
            logger.warning(f"Попытка регистрации с существующим email: {user.email}")
            raise HTTPException(
                status_code=400, detail="User with this email already exists"
            )

        current_user = User(
            email=user.email,
            password=get_password_hash(user.password),
            username=create_username_by_email(user.email),
            email_confirmed=False
        )
        db.add(current_user)
        await db.commit()
        await db.refresh(current_user)
        
        logger.info(f"Пользователь успешно создан: {current_user.id}")
        return current_user
        
    except Exception as e:
        logger.error(f"Ошибка при создании пользователя: {str(e)}")
        raise


# Логин пользователя
async def login_user(db: AsyncSession, user_data: SUserLogin):
    user = await db.execute(select(User).where(User.email == user_data.email))
    user = user.scalar_one_or_none()

    if not user or not password_compare(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id)})
    return token
