from sqlalchemy import create_engine
from backend.models.User import Base

# Подключение к базе данных
engine = create_engine('DATABASE_URL')  # Замените на вашу фактическую строку подключения

# Очистка метаданных
Base.metadata.clear()

# Пересоздание таблиц
Base.metadata.create_all(bind=engine)