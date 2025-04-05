import pytest
import asyncio
import io
from unittest.mock import AsyncMock, MagicMock
from fastapi import UploadFile
from PIL import Image
from src.services.file_service import FileService
from pathlib import Path


# Фикстура для event loop
@pytest.fixture(scope="session")
def event_loop():
    """Создаёт event loop для всех асинхронных тестов"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.mark.asyncio
async def test_image_compression():
    """Тест проверяет корректность сжатия изображения"""
    # Создаем фейковое изображение для теста
    img = Image.new('RGB', (1200, 1200), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    # Создаем мок файла для загрузки
    mock_file = UploadFile(
        filename="test_image.jpg",
        file=img_bytes
    )
    
    # Создаем моки для необходимых зависимостей FileService
    mock_storage = AsyncMock()
    mock_db = AsyncMock()
    
    # Инициализируем сервис
    service = FileService(
        storage=mock_storage,
        upload_dir=Path("test_uploads"),
        allowed_extensions={".jpg", ".jpeg", ".png"},
        max_file_size=10 * 1024 * 1024,  # 10MB
        db=mock_db
    )
    
    # Вызываем метод сжатия изображения
    compressed_file = await service._compress_image(mock_file)
    
    # Проверяем, что изображение было сжато
    compressed_bytes = await compressed_file.read()
    compressed_img = Image.open(io.BytesIO(compressed_bytes))
    
    # Проверяем, что размер не превышает заданный (800x800)
    assert compressed_img.width <= 800
    assert compressed_img.height <= 800
    
    # Проверяем, что сохранились пропорции
    original_ratio = 1200 / 1200  # 1.0 для нашего теста
    compressed_ratio = compressed_img.width / compressed_img.height
    assert abs(original_ratio - compressed_ratio) < 0.05  # Допускаем небольшую погрешность 