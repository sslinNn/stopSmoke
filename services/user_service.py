from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.User import User
from schemas.user_schema import SUserProfile
from exceptions.user_exceptions import UserNotFoundException
import logging
from logging import Logger

from services.utils import user_existing_by_id

logger: Logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_data(self, user_id: int):
        try:
            user = await user_existing_by_id(user_id=user_id, db=self.db)
            if not user:
                logger.warning(f"Пользователь не найден: {user_id}")
                raise UserNotFoundException(f"Пользователь с ID {user_id} не найден")

            return user

        except Exception as e:
            logger.error(f"Ошибка при получении пользователя из БД: {str(e)}")
            raise

    async def update_user(self, user_id: int, user_data: SUserProfile) -> User:
        try:
            logger.info(f"Попытка обновления пользователя с ID: {user_id}")

            user = await user_existing_by_id(user_id=user_id, db = self.db)
            if not user:
                logger.warning(f"Пользователь не найден: {user_id}")
                raise UserNotFoundException(f"Пользователь с ID {user_id} не найден")

            update_data = user_data.dict(exclude_unset=True)
            logger.debug(f"Данные для обновления: {update_data}")
            for key, value in update_data.items():
                setattr(user, key, value)

            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            logger.info(f"Пользователь успешно обновлен: {user_id}")
            return user

        except Exception as e:
            logger.error(f"Ошибка при обновлении пользователя {user_id}: {str(e)}")
            raise
