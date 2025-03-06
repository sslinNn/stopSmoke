import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from models.User import User, Base
from utils.password_utils import get_password_hash

# Создаем тестовую БД
TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/test_db"


@pytest.fixture(scope="session")
def engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    return engine


@pytest.fixture(scope="session")
async def async_session(engine):
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        yield session


@pytest.fixture
async def test_user(async_session):
    user = User(
        email="test@test.com",
        username="testuser",
        password=get_password_hash("testpass123"),
    )
    async_session.add(user)
    await async_session.commit()
    await async_session.refresh(user)
    return user
