from datetime import datetime, UTC, timezone

from asyncpg.pgproto.pgproto import timedelta
from pydantic import Field
from src.schemas.core_schema import CoreSchema

class SCraving(CoreSchema):
    reason_id: int = Field(..., description='ID причины')
    is_smoking: bool = Field(..., description='Покурил?')
    intensity: int = Field(..., description='Интенсивность тяги')

class SReason(CoreSchema):
    reason: str = Field(None, description="Причина")