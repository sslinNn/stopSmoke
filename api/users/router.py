from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from api.users.users_utils import get_current_user, update_user
from database.database import get_db
from models.User import User
from schemas.UserSchema import UserUpdate
from services.user_service import UserService
from exceptions.user_exceptions import UserNotFoundException

router = APIRouter()


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    user = {
        "username": current_user.username,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email_confirmed": current_user.email_confirmed,
    }
    return user


@router.patch("/update", response_model=UserUpdate)
async def update_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_service = UserService(db)
    try:
        return await user_service.update_user(current_user.id, user_data)
    except UserNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
