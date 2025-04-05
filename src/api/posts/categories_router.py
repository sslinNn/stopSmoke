from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.posts import Categories
from src.schemas.post_category_schema import SCategory

router = APIRouter()

@router.get("/")
async def get_all_categories(db: AsyncSession = Depends(get_db)):
    stmt = select(Categories)
    result = await db.execute(stmt)
    return {"success": True, "data": result.scalars().all()}


@router.post("/")
async def add_category(data: SCategory, db: AsyncSession = Depends(get_db)):
    new_category = Categories(name=data.name)
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    return {"success": True, "data": new_category.name}
