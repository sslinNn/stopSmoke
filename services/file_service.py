import os
from fastapi import UploadFile
import aiofiles
import logging
from logging import Logger
from enums.enums import ALLOWED_EXTENSIONS

logger: Logger = logging.getLogger(__name__)

class FileService:
    def __init__(self, upload_dir: str = "uploads/avatars"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
    
    async def save_avatar(self, file: UploadFile, user_id: int) -> str:
        try:
            file_extension = os.path.splitext(file.filename)[1].lower()
            if file_extension not in ALLOWED_EXTENSIONS:
                raise ValueError("Неподдерживаемый формат файла! Разрешены: PNG, JPG, JPEG")
            # Генерируем уникальное имя файла
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"user_{user_id}{file_extension}"
            filepath = os.path.join(self.upload_dir, filename)
            
            # Сохраняем файл
            async with aiofiles.open(filepath, 'wb') as out_file:
                content = await file.read()
                await out_file.write(content)
                
            logger.info(f"Аватар успешно сохранен: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Ошибка при сохранении аватара: {str(e)}")
            raise 