from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.craving_for_smoking import Reason
from src.schemas.craving_schema import SReason

router = APIRouter()

@router.get("/")
async def get_reasons(db: AsyncSession = Depends(get_db)):
    stmt = select(Reason)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/")
async def add_reason(data = Depends(SReason), db: AsyncSession = Depends(get_db)):
    new_reason = Reason(
        reason=data.reason,
    )
    db.add(new_reason)
    await db.commit()
    await db.refresh(new_reason)
    return new_reason

@router.get("/{reason_id}")
async def get_reason(reason_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Reason).where(Reason.id == reason_id)
    result = await db.execute(stmt)
    return result.scalars().first()



