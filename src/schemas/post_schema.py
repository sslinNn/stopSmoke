from pydantic import Field

from src.schemas.core_schema import CoreSchema


class SPosts(CoreSchema):
    title: str = Field(..., title='Title')
    content: str = Field(..., title='MarkDown content')
    category: int = Field(..., title='Category_ID')
