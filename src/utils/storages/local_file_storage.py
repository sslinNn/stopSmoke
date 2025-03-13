import aiofiles
from fastapi import UploadFile
from src.interfaces.file_storage_interface import FileStorageInterface
from pathlib import Path


class LocalFileStorage(FileStorageInterface):
    def __init__(self):
        self.base_path = Path("uploads")
        self.base_path.mkdir(exist_ok=True)

    async def save_file(self, file: UploadFile, path: str) -> str:
        file_path = self.base_path / path
        file_path.parent.mkdir(parents=True, exist_ok=True)

        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        return str(file_path)

    async def delete_file(self, path: str) -> bool:
        try:
            file_path = Path(path)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False