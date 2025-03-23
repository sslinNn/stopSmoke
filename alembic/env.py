import asyncio
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

# Импорт моделей (убедитесь, что все модели импортированы)
from src.database import Base
from src.models.users import Base
from src.models.craving_for_smoking import Base
from src.models.posts import Base

from config import get_db_url
db_url = get_db_url()

# Конфигурация Alembic
config = context.config

# Логирование
if config.config_file_name:
    fileConfig(config.config_file_name)

# Подключение к метаданным SQLAlchemy
target_metadata = Base.metadata

# Создаём асинхронный движок
connectable = create_async_engine(db_url, echo=True)

async def run_migrations_online():
    """Запуск миграций в режиме online."""
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

def do_run_migrations(connection):
    """Настройка и выполнение миграций."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,  # Сравнивать типы данных
        compare_server_default=True,  # Сравнивать значения по умолчанию на сервере
    )
    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    raise RuntimeError("Offline migrations are not supported.")
else:
    asyncio.run(run_migrations_online())