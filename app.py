import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from src.api import main_router

# Конфигурация логирования
logger = logging.getLogger(__name__)

app = FastAPI(title="Party Finder")

# UPLOAD_DIR = "uploads"
# AVATAR_DIR = os.path.join(UPLOAD_DIR, "avatars")

# Добавляем middleware
# app.middleware("http")(error_handler)

# Разрешённые источники
ORIGINS = [
    "http://localhost:5173",  # React (Vite)
    "http://127.0.0.1:5173",  # React на 127.0.0.1
    # "*",
    "http://localhost:5174"
]

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(main_router)

# Создаем директории при запуске
UPLOAD_DIR = Path("uploads")
AVATARS_DIR = UPLOAD_DIR / "avatars"
AVATARS_DIR.mkdir(parents=True, exist_ok=True)

# Монтируем директорию для статических файлов
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
async def startup_event():
    logger.info("Приложение запущено")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Приложение остановлено")


@app.get('/', tags=["Main"])
async def index():
    return {"message": "Hello World"}
