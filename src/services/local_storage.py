from pathlib import Path
from fastapi import UploadFile
import shutil
import os
from src.interfaces.file_storage_interface import FileStorageInterface

class LocalFileStorage(FileStorageInterface):
    def __init__(self, upload_dir: Path):
        self.upload_dir = upload_dir

    async def save_file(self, file: UploadFile, file_path: str) -> str:
        """Сохраняет файл локально"""
        full_path = self.upload_dir / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        with full_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return file_path

    async def delete_file(self, file_path: str) -> None:
        """Удаляет файл"""
        if not file_path:
            return
            
        full_path = self.upload_dir / file_path
        if full_path.exists():
            os.remove(full_path) 