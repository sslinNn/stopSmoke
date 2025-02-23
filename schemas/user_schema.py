from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from schemas.core_schema import CoreSchema

class SUserBase(CoreSchema):
    email: Optional[EmailStr] = Field(None, description="Email пользователя")
    username: Optional[str] = Field(None, description="Имя пользователя")

class SUserProfile(SUserBase):
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")

class SUserCreate(SUserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="Пароль пользователя"
    )
    password_repeat: str = Field()

class SUserLogin(SUserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="User password",
        pattern=r"^[^а-яА-ЯёЁ]*$",
    )

class SUserUpdate(SUserBase):
    email_confirmed: Optional[bool] = Field(None, description="Подтверждение email")
    is_active: Optional[bool] = Field(None, description="Активен ли пользователь")

class SUserResponse(SUserBase):
    id: int = Field(..., description="ID пользователя")
    email_confirmed: bool = Field(default=False, description="Подтверждение email")
    is_active: bool = Field(..., description="Активен ли пользователь")
    created_at: datetime = Field(..., description="Дата создания")
    updated_at: datetime = Field(..., description="Дата обновления")

    class Config:
        from_attributes = True

class SUserProfileResponse(BaseModel):
    username: str = Field(..., description="Имя пользователя")
    email: EmailStr = Field(..., description="Email")
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")
    email_confirmed: bool = Field(..., description="Подтверждение email") 