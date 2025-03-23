from pydantic import Field

from src.schemas.core_schema import CoreSchema


class SCategory(CoreSchema):
    name: str = Field(..., title='Name')