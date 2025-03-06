import pytest
from services.user_service import UserService
from exceptions.user_exceptions import UserNotFoundException

@pytest.fixture
async def user_service(async_session):
    return UserService(async_session)

@pytest.mark.asyncio
async def test_get_user_data_success(user_service, test_user):
    user = await user_service.get_user_data(test_user.id)
    assert user is not None
    assert user.id == test_user.id
    assert user.email == test_user.email

@pytest.mark.asyncio
async def test_get_user_data_not_found(user_service):
    with pytest.raises(UserNotFoundException) as exc:
        await user_service.get_user_data(999)  # несуществующий ID
    assert "не найден" in str(exc.value)

@pytest.mark.asyncio
async def test_get_user_data_invalid_id(user_service):
    with pytest.raises(Exception):
        await user_service.get_user_data("invalid_id") 