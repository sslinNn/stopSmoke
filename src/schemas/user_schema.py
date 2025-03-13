from typing import Optional

from pycparser.c_ast import Union
from pydantic import Field, EmailStr
from pydantic_core.core_schema import UnionSchema

from src.schemas.core_schema import CoreSchema

class SUserBase(CoreSchema):
    email: Optional[EmailStr] = Field(None, description="Email пользователя")
    username: Optional[str] = Field(None, pattern=r"^[^а-яА-ЯёЁ]*$", description="Имя пользователя")

class SUserProfile(SUserBase):
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")


class SUserAvatar(CoreSchema):
    avatar_url: Optional[str] = Field(None, description="Путь до аватара")

class SUserProfileAndAvatar(SUserAvatar, SUserProfile):
    pass


""" Responses from API """
class RSUserProfile(CoreSchema):
    success: bool
    user_data: SUserProfileAndAvatar
    # user_data: Optional[SUserProfile, SUserAvatar]