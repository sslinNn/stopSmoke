import pytest
import asyncio
from logging import Logger
from src.database import get_db, Base, engine
from src.models.users import User
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncEngine
from sqlalchemy.orm import sessionmaker
from pathlib import Path
import sys
from httpx import AsyncClient
from app import app

# Настройки для pytest-asyncio
pytest_plugins = ['pytest_asyncio']

# Тестовая БД
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Создаем тестовый движок и sessionmaker
engine = create_async_engine(TEST_DATABASE_URL, echo=True)
TestingSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Фикстура для event loop (исправляет PytestDeprecationWarning)
@pytest.fixture(scope="session")
def event_loop():
    """Создаёт event loop для всех асинхронных тестов"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    """Создает тестовую БД перед тестами и очищает после"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield  # Здесь выполняются тесты
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
async def async_session():
    """Создает новую сессию БД для каждого теста"""
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()  # Откатываем изменения после теста

@pytest.fixture(scope="function")
async def client(async_session):
    """Создает тестовый клиент FastAPI с подменённой БД"""
    def override_get_db():
        yield async_session  # Передаем уже созданную фикстуру

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="function")
async def async_client(async_session):
    """Создает асинхронный клиент FastAPI с подменённой БД"""

    async def override_get_db():
        async for session in async_session():  # Используем async for
            yield session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client  # Теперь `async_client` корректно возвращает `AsyncClient`
