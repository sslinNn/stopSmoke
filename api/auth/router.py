from fastapi import APIRouter, status, Depends, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import JSONResponse, RedirectResponse, Response
from api.auth.auth_utils import create_user, login_user
from database.database import get_db
from schemas.UserSchema import SUserRegister, SUserLogin

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_data: SUserRegister, db: AsyncSession = Depends(get_db)):
    """Добавляет пользователя в базу данных
    :param user_data:
    :param db:
    :return:
    """
    try:
        user = await create_user(db, user_data)
        return JSONResponse(
            content={"message": "User created successfully", "user_id": user.id},
        )
    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"message": e.detail},
        )


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    response: Response, user_data: SUserLogin, db: AsyncSession = Depends(get_db)
):
    """
    Вход пользователя: устанавливает access_token в HttpOnlyCookie
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600 * 24 * 7,
        :param response:
        :param user_data:
        :param db:
        :return:
    """
    try:
        token = await login_user(db, user_data)

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=3600 * 24 * 7,
        )

        return {"message": "logged in successfully"}

    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"message": e.detail},
        )


@router.get("/logout")
async def logout(request: Request) -> Response:
    """Выход пользователя: удаляет access_token
    :param request:
    :return:
    """
    response = Response(status_code=200)
    response.delete_cookie("access_token")
    return response
