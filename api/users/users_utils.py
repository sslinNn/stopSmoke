from fastapi import Depends, HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import current_user
from starlette.requests import Request
import logging

from database.database import get_db
from models.User import User
from utils.JWTUtils import decode_access_token

logger = logging.getLogger(__name__)

# Функция для декодирования токена и получения данных пользователя
async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        token = request.cookies.get('access_token')
        if not token:
            logger.warning("Токен отсутствует в cookies")
            raise HTTPException(
                status_code=401, 
                detail="Токен авторизации отсутствует"
            )

        try:
            payload = decode_access_token(token)
        except JWTError as e:
            logger.error(f"Ошибка декодирования токена: {str(e)}")
            raise HTTPException(
                status_code=401, 
                detail=f"Ошибка валидации токена: {str(e)}"
            )

        user_id = payload.get("sub")
        if not user_id:
            logger.error("Токен не содержит ID пользователя")
            raise HTTPException(
                status_code=401, 
                detail="Некорректный формат токена"
            )

        try:
            stmt = select(User).where(User.id == int(user_id))
            result = await db.execute(stmt)
            user = result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Ошибка при получении пользователя из БД: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Ошибка при получении данных пользователя"
            )

        if not user:
            logger.warning(f"Пользователь с ID {user_id} не найден")
            raise HTTPException(
                status_code=404, 
                detail=f"Пользователь с ID {user_id} не найден"
            )

        return user

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Необработанная ошибка: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )


async def update_user(user_to_update: User, db: AsyncSession):
    """Сохраняет обновленного пользователя в БД."""
    print(user_to_update)
    db.add(user_to_update)  # Не забудь добавить объект перед коммитом
    await db.commit()
    await db.refresh(user_to_update)
    return user_to_update