from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.database import get_db

router = APIRouter()


@router.get("/me")
async def get_me(db: AsyncSession = Depends(get_db), token: str = None):
    return {"message": "ok"}
