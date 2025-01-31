from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from backend.api.users.repository import create_user
from backend.database.database import get_db
from backend.schemas.UserSchema import SUserRegister

router = APIRouter()


@router.post("/register")
async def register_user(user_data: SUserRegister, db: AsyncSession = Depends(get_db)):
    await create_user(db, user_data)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"message": "User created successfully"},
    )
