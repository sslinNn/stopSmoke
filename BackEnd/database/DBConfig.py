from dotenv import load_dotenv
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from backend.models.User import Base

load_dotenv()
db_url = os.getenv('DATABASE_URL')

if not db_url:
    raise ValueError("DATABASE_URL is not set in the .env file")

engine = create_async_engine(db_url, echo=True)

async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with async_session_maker() as session:
        yield session
