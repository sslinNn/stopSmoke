from fastapi import Depends, HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from starlette.requests import Request

from backend.database.database import get_db
from backend.models.User import User
from backend.utils.JWTUtils import decode_access_token



# Функция для декодирования токена и получения данных пользователя
async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        token = request.cookies.get('access_token')
        print(f"Received token: {token}")
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        print(payload, user_id)

        if not user_id:
            raise HTTPException(status_code=401, detail="Неверный токен")

        stmt = select(User).where(User.id == int(user_id))
        result = await db.execute(stmt)
        user_in_db = result.scalar_one_or_none()

        if not user_in_db:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        return user_in_db
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")