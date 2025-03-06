from typing import Optional
from pydantic import  Field, EmailStr
from schemas.core_schema import CoreSchema

class SUserBase(CoreSchema):
    email: Optional[EmailStr] = Field(None, description="Email пользователя")
    username: Optional[str] = Field(None, pattern=r"^[^а-яА-ЯёЁ]*$", description="Имя пользователя")

class SUserProfile(SUserBase):
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")
    avatar_url: Optional[str] = Field(None, description="Путь до аватара")
