import logging
from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse, Response
from src.database import get_db
from src.exceptions.user_exceptions import UserAlreadyExistsException
from src.schemas.auth_schema import SAuthBase, SAuthRegisterClient
from src.services.auth_service import AuthService

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    description="Регистрация нового пользователя",
)
async def register_user(user_data: SAuthRegisterClient, db: AsyncSession = Depends(get_db)):
    logger.info(f"Запрос на регистрацию пользователя: {user_data.email}")
    auth_service = AuthService(db)
    try:
        user = await auth_service.create_user(user_data)
        return user
    except UserAlreadyExistsException as UAE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(UAE))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/login", description="Вход пользователя")
async def login(
    response: Response, login_data: SAuthBase, db: AsyncSession = Depends(get_db)
):
    logger.info(f"Попытка входа пользователя: {login_data.email}")
    auth_service = AuthService(db)
    try:
        token = await auth_service.login_user(login_data.email, login_data.password)
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
