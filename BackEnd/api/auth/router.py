from fastapi import APIRouter, status, Depends, Response, security, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from backend.api.auth.utils import create_user
from backend.database.database import get_db
from backend.models.User import User
from backend.schemas.UserSchema import SUserRegister, SUserLogin
from backend.utils.JWTUtils import create_access_token

router = APIRouter()


@router.post("/register")
async def register_user(user_data: SUserRegister, db: AsyncSession = Depends(get_db)):
    try:
        user = await create_user(db, user_data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "User created successfully", "user_id": user.id},
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)},
        )


@router.post("/login")
async def login(
    response: Response, user_data: SUserLogin, db: AsyncSession = Depends(get_db)
):
    user = await db.execute(select(User).where(User.email == user_data.email))
    user = user.scalar_one_or_none()

    if not user or not user_data.password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    data = {"sub": user.id}
    token = create_access_token(data)
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600 * 24 * 7,
    )
    return {"message": "Logged in successfully"}
