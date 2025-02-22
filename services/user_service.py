from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.User import User
from schemas.UserSchema import UserUpdate
from exceptions.user_exceptions import UserNotFoundException
import logging
from logging import Logger

logger: Logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        try:
            logger.info(f"Попытка обновления пользователя с ID: {user_id}")
            
            result = await self.db.execute(select(User).filter(User.id == user_id))
            user = result.scalar_one_or_none()
            
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