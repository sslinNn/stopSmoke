from cryptography.hazmat.backends.openssl import backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware
from middleware.error_handler import error_handler
from core.container import Container
import os
import logging
from pathlib import Path
from logging.config import dictConfig

app = FastAPI(title="Party Finder")

# Инициализация контейнера
container = Container()
app.container = container

# Добавляем middleware
app.middleware("http")(error_handler)

# Разрешённые источники
origins = [
    "http://localhost:5173",  # React (Vite)
    "http://127.0.0.1:5173",  # React на 127.0.0.1
]

# app.add_middleware(AuthenticationMiddleware, backend=)
# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешаем запросы с фронта
    allow_credentials=True,  # Разрешаем куки
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Роутеры

from api.auth.router import router as auth_router
from api.users.router import router as users_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])

# Создаём абсолютный путь к директории логов
BASE_DIR = Path(__file__).resolve().parent
LOG_DIR = BASE_DIR / "logs"

# Создаём директорию для логов с проверкой прав доступа
try:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_file = LOG_DIR / "app.log"
    # Проверяем права на запись
    if not os.access(LOG_DIR, os.W_OK):
        raise PermissionError(f"Нет прав на запись в директорию {LOG_DIR}")
except Exception as e:
    print(f"Ошибка при создании директории логов: {e}")
    raise

# Конфигурация логирования
logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "default",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": str(log_file),  # Используем абсолютный путь
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "formatter": "default",
            "encoding": "utf-8",  # Явно указываем кодировку
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"]
    },
    # Настраиваем логгеры для разных модулей
    "loggers": {
        "api": {
            "level": "INFO",
            "handlers": ["console", "file"],
            "propagate": False
        },
        "services": {
            "level": "INFO",
            "handlers": ["console", "file"],
            "propagate": False
        }
    }
}

# Применяем конфигурацию логирования
try:
    dictConfig(logging_config)
    logger = logging.getLogger(__name__)
    logger.info("Логирование успешно настроено")
except Exception as e:
    print(f"Ошибка при настройке логирования: {e}")
    raise
