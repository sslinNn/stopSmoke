import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from logging.config import dictConfig
from fastapi.staticfiles import StaticFiles
from core.logging_config import LOGGING_CONFIG
from middleware.error_handler import error_handler
from core.container import Container

# Применяем конфигурацию логирования
dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Party Finder")

# Инициализация контейнера
container = Container()
app.container = container

UPLOAD_DIR = "uploads"
AVATAR_DIR = os.path.join(UPLOAD_DIR, "avatars")

# Добавляем middleware
app.middleware("http")(error_handler)

# Разрешённые источники
origins = [
    "http://localhost:5173",  # React (Vite)
    "http://127.0.0.1:5173",  # React на 127.0.0.1
]

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
from routers.auth_router import router as auth_router
from routers.users_router import router as users_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])


app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.on_event("startup")
async def startup_event():
    logger.info("Приложение запущено")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Приложение остановлено")
