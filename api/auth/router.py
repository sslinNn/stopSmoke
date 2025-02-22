from fastapi import APIRouter, status, Depends, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse, RedirectResponse, Response
from api.auth.auth_utils import create_user, login_user
from database.database import get_db
from exceptions.user_exceptions import UserAlreadyExistsException
import logging
from schemas.auth_schema import AuthRegister, AuthLogin

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    description="Регистрация нового пользователя",
)
async def register_user(user_data: AuthRegister, db: AsyncSession = Depends(get_db)):
    logger.info(f"Запрос на регистрацию пользователя: {user_data.email}")
    try:
        user = await create_user(db, user_data)
        return user
    except UserAlreadyExistsException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", description="Вход пользователя")
async def login(
    response: Response, login_data: AuthLogin, db: AsyncSession = Depends(get_db)
):
    logger.info(f"Попытка входа пользователя: {login_data.email}")
    try:
        token = await login_user(db, login_data)
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=3600 * 24 * 7,
        )
    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"message": e.detail},
        )


@router.get("/logout", status_code=status.HTTP_200_OK, description="Выход пользователя")
async def logout():
    response = JSONResponse(content={"message": "Успешный выход"})
    response.delete_cookie("access_token")
    return response
