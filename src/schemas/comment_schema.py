from pydantic import Field
from datetime import datetime
from typing import Optional

from src.schemas.core_schema import CoreSchema


class SCommentCreate(CoreSchema):
    """Схема для создания комментария"""
    post_id: int = Field(..., title='ID поста')
    content: str = Field(..., title='Текст комментария')


class SCommentResponse(CoreSchema):
    """Схема для ответа с комментарием"""
    id: int = Field(..., title='ID комментария')
    post_id: int = Field(..., title='ID поста')
    user_id: int = Field(..., title='ID пользователя')
    content: str = Field(..., title='Текст комментария')
    created_at: datetime = Field(..., title='Дата создания')
    username: Optional[str] = Field(None, title='Имя пользователя')
    avatar_url: Optional[str] = Field(None, title='URL аватара пользователя') 