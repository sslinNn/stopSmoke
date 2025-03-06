import pytest
from jose import jwt
from utils.jwt_utils import decode_access_token, get_auth_data, create_access_token

@pytest.fixture
def auth_data():
    return {
        "secret_key": "test_secret_key",
        "algorithm": "HS256",
        "access_token_expire_minutes": 30
    }

@pytest.fixture
def valid_token(auth_data):
    return create_access_token({"sub": "123"})

def test_decode_access_token_valid(valid_token):
    payload = decode_access_token(valid_token)
    assert payload is not None
    assert "sub" in payload
    assert payload["sub"] == "123"

def test_decode_access_token_invalid():
    invalid_token = "invalid.token.here"
    payload = decode_access_token(invalid_token)
    assert payload is None

def test_decode_access_token_none():
    payload = decode_access_token(None)
    assert payload is None 