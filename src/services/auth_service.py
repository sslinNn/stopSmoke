import logging
from logging import Logger
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, HTTPException
from src.models.users import User
from src.schemas.auth_schema import SAuthRegisterServer
from utils.services_utils import user_existing_by_email, create_username_by_email
from utils.jwt_utils import create_access_token
from utils.password_utils import password_compare, get_password_hash

logger: Logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user: SAuthRegisterServer) -> User:
        try:
            logger.info(f"Попытка создания пользователя с email: {user.email}")
            if user.password != user.password_repeat:
                raise HTTPException(  # TODO: ЗАМЕНИ НА СВОЙ EXCEPTION
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Passwords don't match",
                )

            email = await user_existing_by_email(user.email, self.db)
            if email:
                logger.warning(
                    f"Попытка регистрации с существующим email: {user.email}"
                )
                raise HTTPException(  # TODO: ЗАМЕНИ НА СВОЙ EXCEPTION
                    status_code=409, detail="User with this email already exists"
                )

            new_user = User(
                email=user.email,
                password=get_password_hash(user.password),
                username=create_username_by_email(user.email),
            )
            self.db.add(new_user)
            await self.db.commit()
            await self.db.refresh(new_user)

            logger.info(f"Пользователь успешно создан!")
            return new_user
        except Exception as e:
            logger.exception(e)
            raise HTTPException(  # TODO: ЗАМЕНИ НА СВОЙ EXCEPTION
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Something went wrong: {e}",
            )

    async def login_user(self, email: str, password: str) -> str:
        user = await user_existing_by_email(email, self.db)

        if not user:
            raise HTTPException(  # TODO: ЗАМЕНИ НА СВОЙ EXCEPTION
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email not found",
            )
        if not password_compare(password, user.password):
            raise HTTPException(  # TODO: ЗАМЕНИ НА СВОЙ EXCEPTION
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password",
            )

        token = create_access_token({"sub": str(user.id)})
        return token
