from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Party Finder")

# Разрешённые источники
origins = [
    "http://localhost:5173",  # React (Vite)
    "http://127.0.0.1:5173",  # React на 127.0.0.1
]

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
