import pytest
from src.utils.jwt_utils import (
    create_access_token,
    decode_access_token,
    get_id_from_access_token,
)

data = {"sub": str(37)}
access_token = create_access_token(data=data)


def test_create_access_token():
    assert isinstance(create_access_token(data), str)


def test_decode_access_token():
    assert isinstance(decode_access_token(access_token), dict)


@pytest.mark.asyncio
async def test_get_id_from_access_token():
    user_id = await get_id_from_access_token(access_token)
    assert isinstance(user_id, int)
