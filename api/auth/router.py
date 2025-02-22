from fastapi import APIRouter, status, Depends, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import JSONResponse, RedirectResponse, Response
from api.auth.auth_utils import create_user, login_user
from database.database import get_db
from schemas.UserSchema import SUserRegister, SUserLogin
from exceptions.user_exceptions import UserAlreadyExistsException
import logging

router = APIRouter()

logger = logging.getLogger(__name__)


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
            content={"message": "Пользователь успешно создан", "user_id": user.id},
        )
    except UserAlreadyExistsException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
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


@router.get("/test-logging")
async def test_logging():
    logger.debug("Это debug сообщение")
    logger.info("Это info сообщение")
    logger.warning("Это warning сообщение")
    try:
        raise ValueError("Тестовая ошибка")
    except Exception as e:
        logger.error(f"Это error сообщение: {str(e)}", exc_info=True)
    return {"message": "Логи записаны"}
