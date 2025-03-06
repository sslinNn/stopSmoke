import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from models.User import User
from schemas.auth_schema import SAuthRegisterServer
from services.auth_service import AuthService

@pytest.fixture
async def auth_service(async_session):
    return AuthService(async_session)

@pytest.fixture
def valid_user_data():
    return SAuthRegisterServer(
        email="test@example.com",
        password="testpass123",
        password_repeat="testpass123"
    )

@pytest.mark.asyncio
async def test_create_user_success(auth_service, valid_user_data):
    new_user = await auth_service.create_user(valid_user_data)
    assert isinstance(new_user, User)
    assert new_user.email == valid_user_data.email
    assert new_user.password != valid_user_data.password  # проверка хеширования

@pytest.mark.asyncio
async def test_create_user_passwords_dont_match(auth_service):
    invalid_data = SAuthRegisterServer(
        email="test@example.com",
        password="pass1",
        password_repeat="pass2"
    )
    with pytest.raises(HTTPException) as exc:
        await auth_service.create_user(invalid_data)
    assert exc.value.status_code == 401
    assert "Passwords don't match" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_create_user_email_exists(auth_service, valid_user_data):
    # Первая регистрация
    await auth_service.create_user(valid_user_data)
    
    # Повторная регистрация с тем же email
    with pytest.raises(HTTPException) as exc:
        await auth_service.create_user(valid_user_data)
    assert exc.value.status_code == 409
    assert "already exists" in str(exc.value.detail) 