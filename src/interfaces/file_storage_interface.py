from abc import ABC, abstractmethod
from fastapi import UploadFile


class FileStorageInterface(ABC):
    @abstractmethod
    async def save_file(self, file: UploadFile, path: str) -> str:
        pass

    @abstractmethod
    async def delete_file(self, path: str) -> bool:
        pass
