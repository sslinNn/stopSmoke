import logging
from datetime import datetime, UTC

from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse, Response
from src.database import get_db
from src.exceptions.user_exceptions import UserAlreadyExistsException
from src.schemas.auth_schema import SAuthBase, SAuthRegisterClient
from src.schemas.user_schema import RSUserLogin, RSUserLogout, RSUserProfile, RSUserRegistration
from src.services.auth_service import AuthService
from src.utils.jwt_utils import decode_access_token

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    description="Регистрация нового пользователя",
    response_model=RSUserRegistration
)
async def register_user(user_data= Depends(SAuthRegisterClient), db: AsyncSession = Depends(get_db)):
    logger.info(f"Запрос на регистрацию пользователя: {user_data.email}")
    auth_service = AuthService(db)
    try:
        user = await auth_service.create_user(user_data)
        return {"success": True, "message": 'Пользователь успешно зарегистрирован!'}
    except UserAlreadyExistsException as UAE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(UAE))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/login", description="Вход пользователя", response_model=RSUserLogin)
async def login(
    response: Response, login_data = Depends(SAuthBase), db: AsyncSession = Depends(get_db)
):
    logger.info(f"Попытка входа пользователя: {login_data.email}")
    auth_service = AuthService(db)
    try:
        token = await auth_service.login_user(login_data.email, login_data.password)
        token_data = decode_access_token(token)
        expires_timestamp = token_data['exp']
        
        # Вычисляем время жизни токена в секундах
        current_timestamp = datetime.now(UTC).timestamp()
        max_age = int(expires_timestamp - current_timestamp)
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=max_age,  # Используем время в секундах, а не timestamp
        )
        return {"success": True, "message": "Пользователь успешно аутентифицирован!" }
    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"message": e.detail},
        )


@router.post("/logout", description="Выход пользователя")
async def logout():
    response = JSONResponse(content={"message": "Успешный выход"})
    response.delete_cookie("access_token")
    return response