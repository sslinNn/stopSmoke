from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import logger
from schemas.user_schema import UserUpdate, UserResponse, UserProfileResponse, UserProfile
from database.database import get_db
from services.user_service import UserService
from api.users.users_utils import get_current_user
from models.User import User

router = APIRouter()


@router.get(
    "/me",
    response_model=UserProfileResponse,
    description="Получение данных текущего пользователя",
)
async def get_me(current_user: User = Depends(get_current_user)):
    logger.info(f"Запрос данных пользователя: {current_user.id}")
    return current_user


@router.patch(
    "/update", response_model=UserResponse, description="Обновление данных пользователя"
)
async def update_user(
    user_data: UserProfile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    logger.info(f"Запрос на обновление пользователя: {current_user.id}")
    user_service = UserService(db)
    updated_user = await user_service.update_user(current_user.id, user_data)
    return updated_user
