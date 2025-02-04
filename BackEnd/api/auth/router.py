from fastapi import APIRouter, status, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from backend.api.auth.repository import create_user, get_user_access_token
from backend.database.database import get_db
from backend.schemas.UserSchema import SUserRegister, SUserLogin

router = APIRouter()


@router.post("/register")
async def register_user(user_data: SUserRegister, db: AsyncSession = Depends(get_db)):
    try:
        await create_user(db, user_data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "User created successfully"},
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)},
        )


@router.post("/login")
async def signin_user(
    response: Response, user_data: SUserLogin, db: AsyncSession = Depends(get_db)
):
    try:
        access_token = await get_user_access_token(db, user_data)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,  # Для dev: secure=False, если HTTP
            samesite="None",
            path="/"
        )
        response.status_code = status.HTTP_202_ACCEPTED
        return {"message": "User logged successfully"}
    except Exception as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": str(e)}