from datetime import datetime, timezone

from starlette import status
from starlette.requests import Request
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.craving_for_smoking import CravingForSmoking
from src.schemas.craving_schema import SCraving
from src.utils.jwt_utils import get_id_from_access_token

router = APIRouter()

@router.get("/")
async def get_cravings():
    pass

@router.post("/")
async def add_craving(request: Request, data = Depends(SCraving), db: AsyncSession = Depends(get_db)):
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

