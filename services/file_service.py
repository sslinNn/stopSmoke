from fastapi import UploadFile, HTTPException
import logging
from logging import Logger
from typing import Optional
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from interfaces.file_storage_interface import FileStorageInterface
from utils.services_utils import user_existing_by_id

logger: Logger = logging.getLogger(__name__)


class FileService:
    def __init__(
        self,
        storage: FileStorageInterface,
        upload_dir: Path,
        allowed_extensions: set[str],
        max_file_size: int,
        db: AsyncSession
    ):
        self.storage = storage
        self.upload_dir = upload_dir
        self.allowed_extensions = allowed_extensions
        self.max_file_size = max_file_size
        self.db = db

    async def save_avatar(self, file: UploadFile, user_id: int) -> str:
        try:
            await self._validate_file(file)

            # Удаляем старый аватар
            old_avatar = await self._get_existing_avatar(user_id)
            if old_avatar:
                await self.storage.delete_file(old_avatar)

            file_path = await self._generate_file_path(file, user_id)
            return await self.storage.save_file(file, file_path)

        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logging.error(f"Failed to save avatar for user {user_id}", exc_info=e)
            raise HTTPException(status_code=500, detail="Internal server error")

    async def _validate_file(self, file: UploadFile) -> None:
        if not file.filename:
            raise ValueError("Filename is required")

        extension = Path(file.filename).suffix.lower()
        if extension not in self.allowed_extensions:
            raise ValueError(
                f"Unsupported file type. Allowed: {self.allowed_extensions}"
            )

        content = await file.read()
        if len(content) > self.max_file_size:
            raise ValueError(
                f"File size exceeds {self.max_file_size // 1024 // 1024}MB"
            )

        # Возвращаем указатель файла в начало
        await file.seek(0)

    async def _get_existing_avatar(self, user_id: int) -> Optional[str]:
        """
        Получает путь к существующему аватару пользователя

        Args:
            user_id: ID пользователя

        Returns:
            Optional[str]: Путь к файлу аватара или None, если аватар не найден
        """
        try:
            user = await user_existing_by_id(user_id=user_id, db=self.db)
            if user and user.avatar_url:
                return user.avatar_url
            return None
        except Exception as e:
            logger.error(f"Error getting existing avatar for user {user_id}: {str(e)}")
            return None

    async def _generate_file_path(self, file: UploadFile, user_id: int) -> str:
        """
        Генерирует путь для сохранения нового файла аватара

        Args:
            file: Загруженный файл
            user_id: ID пользователя

        Returns:
            str: Путь для сохранения файла
        """
        extension = Path(file.filename).suffix.lower()
        # Создаем структуру директорий по user_id для лучшей организации
        # Например: avatars/000/000/001/avatar.jpg для user_id=1
        user_id_str = str(user_id).zfill(9)  # Паддинг до 9 цифр
        path_parts = [user_id_str[i : i + 3] for i in range(0, len(user_id_str), 3)]

        relative_path = Path("avatars") / Path(*path_parts) / f"avatar{extension}"

        # Создаем директории, если они не существуют
        full_path = self.upload_dir / relative_path
        full_path.parent.mkdir(parents=True, exist_ok=True)

        return str(relative_path)
