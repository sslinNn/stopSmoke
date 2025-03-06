from datetime import datetime, timedelta, UTC
from typing import Optional
from jose import jwt, JWTError
from config import get_auth_data


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Генерирует JWT-токен, в payload добавляет data.
    Args:
        data: полезная информация в токене
        expires_delta: время жизни токена, по умолчанию 30 минут.
    Returns:
        str: access_token
    """
    auth_data = get_auth_data()
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=auth_data["access_token"])
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, auth_data["secret_key"], algorithm=auth_data["algorithm"]
    )
    return encoded_jwt


# Декодирование токена
def decode_access_token(token: str) -> dict:
    """
    Декодирует JWT-токен.
    Args:
        token: access_token
    Returns:
        dict: payload, expires_time
    """
    auth_data = get_auth_data()
    try:
        return jwt.decode(
            token, auth_data["secret_key"], algorithms=[auth_data["algorithm"]]
        )
    except JWTError:
        return None


async def get_id_from_access_token(token: str) -> int:
    """
    Получает sub из JWT-токена.
    Args:
        token: access_token
    Returns:
        int: id пользователя
    """
    payload = decode_access_token(token)
    user_id = int(payload.get("sub"))
    return user_id
