import logging
from logging import Logger

from fastapi import HTTPException
from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from models.User import User
from schemas.auth_schema import AuthRegister
from schemas.user_schema import SUserCreate
from utils.jwt_utils import create_access_token
from utils.password_utils import password_compare

logger: Logger = logging.getLogger(__name__)


async def user_existing(email: EmailStr, db: AsyncSession):
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user: SUserCreate):
        try:
            logger.info(f"Попытка создания пользователя с email: {user.email}")
            if user.password != user.password_repeat:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Passwords don't match",
                )

            email = await user_existing(user.email, self.db)
            if email:
                logger.warning(
                    f"Попытка регистрации с существующим email: {user.email}"
                )
                raise HTTPException(                                                   # TODO: ЗАМЕНИ НА СВОЙ EXCEPTION
                    status_code=409, detail="User with this email already exists"
                )

            new_user = User(
                email=user.email,
                password=user.password,
                username=user.username,
            )
            self.db.add(new_user)
            await self.db.commit()
            await self.db.refresh(new_user)

            logger.info(f"Пользователь успешно создан: {user.username}")
            return new_user
        except Exception as e:
            logger.exception(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Something went wrong: {e}",
            )

    async def login_user(self, email: str, password: str):
        user = await user_existing(email, self.db)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email not found",
            )
        if not password_compare(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password",
            )

        token = create_access_token({"sub": str(user.id)})
        return token
