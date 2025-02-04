from datetime import datetime, timezone, timedelta
from jose import jwt
from sqlalchemy.util import await_only

from backend.config import get_auth_data


async def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    auth_data = get_auth_data()
    encode_jwt = jwt.encode(
        to_encode, auth_data["secret_key"], algorithm=auth_data["algorithm"]
    )
    return encode_jwt


def get_payload_from_token(token: str) -> dict:
    auth_data = get_auth_data()
    payload = jwt.decode(
        token=token,
        key=auth_data["secret_key"],
        algorithms="HS256",
    )
    return payload


if __name__ == "__main__":
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNCIsImV4cCI6MTc0MTI2MjY4MX0.ynyHsRrKPqoPamHo4-6Yb7jZbqTuFHEzqoq1Hr2T90g"
    data = get_payload_from_token(key)
    print(data)
