from typing import Optional

from pycparser.c_ast import Union
from pydantic import Field, EmailStr
from pydantic_core.core_schema import UnionSchema

from src.schemas.core_schema import CoreSchema

class SUserBase(CoreSchema):
    email: Optional[EmailStr] = Field(None, description="Email пользователя")
    username: Optional[str] = Field(None, pattern=r"^[^а-яА-ЯёЁ]*$", description="Имя пользователя")

class SUserProfile(SUserBase):
    id: Optional[int]
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")


class SUserAvatar(CoreSchema):
    avatar_url: Optional[str] = Field(None, description="Путь до аватара")

class SUserProfileAndAvatar(SUserAvatar, SUserProfile):
    pass

class SUserProfileAndAvatarPublic(CoreSchema):
    username: Optional[str] = Field(None, pattern=r"^[^а-яА-ЯёЁ]*$", description="Имя пользователя")
    id: Optional[int]
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")
    avatar_url: Optional[str] = Field(None, description="Путь до аватара")

""" Responses from API """
class RSUserProfile(CoreSchema):
    success: bool
    user_data: SUserProfileAndAvatar


class RSUserProfilePublic(CoreSchema):
    success: bool
    user_data: SUserProfileAndAvatarPublic


class RSUserRegistration(CoreSchema):
    success: bool
    message: Optional[str]

class RSUserLogin(CoreSchema):
    success: bool
    message: Optional[str]

class RSUserLogout(CoreSchema):
    success: bool
    message: Optional[str]

class RSUserUpdate(CoreSchema):
    success: bool
    user_data: SUserProfile

class RSUserUpdateAvatar(CoreSchema):
    success: bool
    avatar_data: SUserAvatar