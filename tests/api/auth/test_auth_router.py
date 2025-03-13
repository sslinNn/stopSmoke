import pytest

@pytest.mark.asyncio
async def test_create_user(async_client):
    response = await async_client.post("/auth/register", json={"username": "ivan", "email": "ivan@example.com"})
    assert response.status_code == 201

# def test_login():


