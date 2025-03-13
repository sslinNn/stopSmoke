from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

import config

Base = declarative_base()

db_url = config.get_db_url()
if not db_url:
    raise ValueError("DATABASE_URL is not set in the .env file")

engine = create_async_engine(db_url)
async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db():
    async with async_session_maker() as session:
        yield session
