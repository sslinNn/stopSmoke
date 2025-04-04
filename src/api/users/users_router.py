from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from starlette.requests import Request

from src.models.users import User
from src.schemas.user_schema import SUserProfile, SUserAvatar, RSUserProfile, RSUserUpdateAvatar, RSUserUpdate, \
    RSUserProfilePublic
from src.database import get_db
from src.services.user_service import UserService
from src.utils.jwt_utils import get_id_from_access_token
from pathlib import Path
from src.services.file_service import FileService
from src.services.local_storage import LocalFileStorage

router = APIRouter()

# Добавляем конфигурацию для файлов
UPLOAD_DIR = Path("uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def get_file_service(db: AsyncSession = Depends(get_db)) -> FileService:
    storage = LocalFileStorage(UPLOAD_DIR)
    return FileService(
        storage=storage,
        upload_dir=UPLOAD_DIR,
        allowed_extensions=ALLOWED_EXTENSIONS,
        max_file_size=MAX_FILE_SIZE,
        db=db
    )

@router.get(
    "/me",
    response_model=RSUserProfile,
    description="Получение данных текущего пользователя",
)
async def get_me(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)

    # logger.info(f"Запрос данных пользователя: {user_id}")
    user_service = UserService(db)
    current_user_data = await user_service.get_user_data(user_id)
    return {"success": True, "user_data": current_user_data }


@router.get("/{user_id}", response_model=RSUserProfilePublic, description="Данные пользователя с ID...")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.id == user_id)

    result = await db.execute(stmt)
    return {"success": True, "user_data": result.scalars().one_or_none()}


@router.put(
    "/update",
    response_model=RSUserUpdate,
    description="Обновление данных пользователя",
)
async def update_user(
    request: Request, 
    user_data: SUserProfile,
    db: AsyncSession = Depends(get_db)
):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)

    # logger.info(f"Запрос на обновление пользователя: {user_id}")

    user_service = UserService(db)
    updated_user = await user_service.update_user(user_id, user_data)
    return {"success": True, "user_data": updated_user}

@router.post("/update/avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    file_service: FileService = Depends(get_file_service)
):
    token = request.cookies.get("access_token")
    user_id = await get_id_from_access_token(token)

    user_service = UserService(db)
    updated_user = await user_service.update_user_avatar(user_id, file_service, file)
    return {"success": True, 'avatar_data': updated_user.avatar_url}
