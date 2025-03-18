from datetime import datetime

from pydantic import Field
from src.schemas.core_schema import CoreSchema

class SCraving(CoreSchema):
    user_id: int = Field(..., description='ID пользователя')
    reason_id: int = Field(..., description='ID причины')
    is_smoke: bool = Field(..., description='Покурил?')
    intensity: int = Field(None, description='Интенсивность тяги')
    date: datetime

class SReason(CoreSchema):
    reason: str = Field(None, description="Причина")