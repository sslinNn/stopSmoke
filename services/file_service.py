from fastapi import UploadFile, HTTPException
import logging
from logging import Logger
from typing import Optional
from pathlib import Path
from abc import ABC, abstractmethod

logger: Logger = logging.getLogger(__name__)

class FileStorageInterface(ABC):
    @abstractmethod
    async def save_file(self, file: UploadFile, path: str) -> str:
        pass
    
    @abstractmethod
    async def delete_file(self, path: str) -> bool:
        pass

class FileService: 
    def __init__(
        self, 
        storage: FileStorageInterface,
        upload_dir: Path,
        allowed_extensions: set[str],
        max_file_size: int
    ):
        self.storage = storage
        self.upload_dir = upload_dir
        self.allowed_extensions = allowed_extensions
        self.max_file_size = max_file_size
        
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
            raise ValueError(f"Unsupported file type. Allowed: {self.allowed_extensions}")
            
        content = await file.read()
        if len(content) > self.MAX_FILE_SIZE:
            raise ValueError(f"File size exceeds {self.MAX_FILE_SIZE // 1024 // 1024}MB")
        
        # Возвращаем указатель файла в начало
        await file.seek(0)

    async def _get_existing_avatar(self, user_id: int) -> Optional[str]:
        # Implementation of _get_existing_avatar method
        pass

    async def _generate_file_path(self, file: UploadFile, user_id: int) -> str:
        # Implementation of _generate_file_path method
        pass 