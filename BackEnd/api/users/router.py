# backend/api/users/router.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.api.users.repository import get_users, create_user
from backend.database.DBConfig import get_db
from backend.schemas.UserSchema import UserCreateSchema, UserPublicSchema

router = APIRouter()

# Получение всех пользователей
@router.get("/get_all", response_model=List[UserPublicSchema], tags=["Users list"])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    return await get_users(db)


@router.post("/create", response_model=UserCreateSchema, tags=["Users registration"])
async def create_new_user(user: UserCreateSchema, db: AsyncSession = Depends(get_db)):
    user_dict = user.dict()
    new_user = await create_user(db, user_dict)
    return new_user