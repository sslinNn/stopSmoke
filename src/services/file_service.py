from fastapi import UploadFile, HTTPException
import logging
from logging import Logger
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from src.interfaces.file_storage_interface import FileStorageInterface
from src.utils.services_utils import user_existing_by_id
import uuid
import io
from PIL import Image

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

    async def _compress_image(self, file: UploadFile, max_size: tuple[int, int] = (800, 800), quality: int = 85) -> UploadFile:
        """Сжимает изображение перед сохранением"""
        # Считываем изображение
        content = await file.read()
        # Возвращаем указатель в начало файла для последующего использования
        await file.seek(0)
        
        # Открываем изображение с помощью Pillow
        img = Image.open(io.BytesIO(content))
        
        # Если формат не поддерживает альфа-канал, преобразуем в RGB
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
        
        # Изменяем размер с сохранением пропорций
        img.thumbnail(max_size, Image.LANCZOS)
        
        # Создаем буфер для сжатого изображения
        output = io.BytesIO()
        
        # Сохраняем изображение в буфер с указанным качеством
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        # Создаем новый UploadFile с сжатым содержимым
        compressed_file = UploadFile(
            filename=file.filename,
            file=output
        )
        
        return compressed_file

    async def save_avatar(self, file: UploadFile, user_id: int) -> str:
        try:
            await self._validate_file(file)
            
            # Сжимаем изображение перед сохранением
            compressed_file = await self._compress_image(file)
            
            # Удаляем старый аватар
            user = await user_existing_by_id(user_id, self.db)
            if user and user.avatar_url:
                await self.storage.delete_file(user.avatar_url)

            # Генерируем уникальное имя файла
            extension = ".jpg"  # Всегда сохраняем в JPEG формате после сжатия
            filename = f"{uuid.uuid4()}{extension}"
            file_path = f"avatars/{filename}"  # Просто кладем в папку avatars

            saved_path = await self.storage.save_file(compressed_file, file_path)

            return saved_path

        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Ошибка при сохранении аватара для пользователя {user_id}", exc_info=e)
            raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

    async def _validate_file(self, file: UploadFile):
        # Проверка расширения
        extension = Path(file.filename).suffix.lower()
        if extension not in self.allowed_extensions:
            raise ValueError(
                f"Неподдерживаемый формат файла. Разрешены: {', '.join(self.allowed_extensions)}"
            )

        # Проверка размера
        file.file.seek(0, 2)  # Перемещаемся в конец файла
        size = file.file.tell()  # Получаем размер
        file.file.seek(0)  # Возвращаемся в начало
        
        if size > self.max_file_size:
            raise ValueError(
                f"Файл слишком большой. Максимальный размер: {self.max_file_size / (1024 * 1024)}MB"
            )
