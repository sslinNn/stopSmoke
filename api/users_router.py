from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from app import logger
from schemas.user_schema import SUserResponse, SUserProfileResponse, SUserProfile
from database.database import get_db
from services.user_service import UserService
from utils.jwt_utils import get_id_from_access_token

router = APIRouter()


@router.get(
    "/me",
    response_model=SUserProfileResponse,
    description="Получение данных текущего пользователя",
)
async def get_me(request: Request, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)

    logger.info(f"Запрос данных пользователя: {user_id}")
    user_service = UserService(db)
    current_user_data = await user_service.get_user_data(user_id)
    return current_user_data


@router.patch(
    "/update",
    response_model=SUserResponse,
    description="Обновление данных пользователя",
)
async def update_user(
    request: Request, user_data: SUserProfile, db: AsyncSession = Depends(get_db)
):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)

    logger.info(f"Запрос на обновление пользователя: {user_id}")

    user_service = UserService(db)
    updated_user = await user_service.update_user(user_id, user_data)
    return updated_user
