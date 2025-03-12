from pydantic import BaseModel, ConfigDict

class CoreSchema(BaseModel):
    """Базовая схема для всех моделей"""
    model_config = ConfigDict(
        from_attributes=True,  # Позволяет конвертировать ORM модели
        validate_assignment=True,  # Валидация при присваивании
        extra='forbid',  # Запрещает дополнительные поля
        str_strip_whitespace=True,  # Убирает пробелы в строках
    ) 