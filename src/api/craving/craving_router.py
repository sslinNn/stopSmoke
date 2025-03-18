from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.schemas.craving_schema import SCraving

router = APIRouter()

@router.get("/")
async def get_cravings():
    pass

@router.post("/")
async def add_craving(data: SCraving, db: AsyncSession = Depends(get_db)):
    # user_id = 1
    # data.user_id
    pass

