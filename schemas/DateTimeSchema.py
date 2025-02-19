from datetime import datetime

from pydantic import BaseModel, field_validator
from typing import Optional


class DateTimeSchema(BaseModel):
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    @field_validator("created_at", "updated_at")
    def default_datetime(cls, value) -> datetime:
        return value or datetime.now()
