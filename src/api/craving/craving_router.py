from datetime import datetime, timezone

import sqlalchemy
from sqlalchemy import select, func, case, text
from starlette import status
from starlette.requests import Request
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.craving_for_smoking import CravingForSmoking, Reason
from src.schemas.craving_schema import SCraving
from src.utils.jwt_utils import get_id_from_access_token

router = APIRouter()

@router.get("/")
async def get_cravings(db: AsyncSession = Depends(get_db)):
    stmt = select(CravingForSmoking)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/my")
async def get_my_cravings(
    request: Request,
    page: int = 1,
    db: AsyncSession = Depends(get_db)
):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)
    
    limit = 50
    offset = (page - 1) * limit

    # Получаем общее количество записей
    count_stmt = select(func.count()).select_from(CravingForSmoking).where(CravingForSmoking.user_id == user_id)
    total_count = await db.execute(count_stmt)
    total_records = total_count.scalar()

    # Получаем записи с пагинацией
    stmt = select(
        Reason.reason,
        CravingForSmoking.is_smoking,
        CravingForSmoking.intensity,
        CravingForSmoking.date,
    ).join(Reason, Reason.id == CravingForSmoking.reason_id)\
    .where(CravingForSmoking.user_id == user_id)\
    .order_by(CravingForSmoking.date.desc())\
    .limit(limit)\
    .offset(offset)

    result = await db.execute(stmt)
    data = [
        {
            "reason_id": row[0],
            "is_smoking": row[1],
            "intensity": row[2],
            "date": row[3].isoformat()
        }
        for row in result.all()
    ]
    
    return {
        "items": data,
        "total": total_records,
        "page": page,
        "pages": (total_records + limit - 1) // limit
    }

@router.get("/my/statistics")
async def get_my_cravings_statistics(request: Request, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)

    stmt = (
        select(
            func.count().label("total_episodes"),  # Всего эпизодов
            func.count(case((CravingForSmoking.is_smoking == False, 1))).label("successful"),  # Успешные (не курил)
            func.count(case((CravingForSmoking.is_smoking == True, 1))).label("failures"),  # Срывы (курил)
            func.count(case((CravingForSmoking.date >= func.current_date(), 1))).label("today"),  # Эпизоды за сегодня
            func.count(case((CravingForSmoking.date >= func.current_date() - text("INTERVAL '7 days'"), 1))).label("last_week"),  # За неделю
            func.avg(CravingForSmoking.intensity).label("avg_intensity")  # Средняя интенсивность
        )
        .where(CravingForSmoking.user_id == user_id)
    )

    result = await db.execute(stmt)
    return result.mappings().one_or_none()

@router.post("/")
async def add_craving(request: Request, data: SCraving, db: AsyncSession = Depends(get_db)):
    try:
        token = request.cookies.get("access_token")
        user_id = await get_id_from_access_token(token)

        new_craving = CravingForSmoking(
            user_id=user_id,
            reason_id=data.reason_id,
            is_smoking=data.is_smoking,
            intensity=data.intensity,
            date=datetime.now(timezone.utc),
        )

        db.add(new_craving)
        await db.commit()
        await db.refresh(new_craving)
        return new_craving
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

