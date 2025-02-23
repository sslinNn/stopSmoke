from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from config import get_auth_data


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Генерируем JWT-токен, в payload добавляем data.
    expires_delta - время жизни токена, по умолчанию 30 минут.
    """
    auth_data = get_auth_data()
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=auth_data["access_token"])
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, auth_data["secret_key"], algorithm=auth_data["algorithm"]
    )
    return encoded_jwt


# Декодирование токена
def decode_access_token(token: str):
    auth_data = get_auth_data()
    try:
        return jwt.decode(
            token, auth_data["secret_key"], algorithms=[auth_data["algorithm"]]
        )
    except JWTError:
        return None


async def get_id_from_access_token(token: str) -> int:
    payload = decode_access_token(token)
    user_id = int(payload.get("sub"))
    return user_id


if __name__ == "__main__":
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNCIsImV4cCI6MTc0MTI2MjY4MX0.ynyHsRrKPqoPamHo4-6Yb7jZbqTuFHEzqoq1Hr2T90g"
    data = decode_access_token(key)
    print(data)
