from datetime import datetime
from symtable import Class
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from schemas.core_schema import CoreSchema

class UserBase(CoreSchema):
    email: Optional[EmailStr] = Field(None, description="Email пользователя")
    username: Optional[str] = Field(None, description="Имя пользователя")

class UserProfile(UserBase):
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")

class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="Пароль пользователя"
    )

class UserUpdate(UserBase):
    email_confirmed: Optional[bool] = Field(None, description="Подтверждение email")
    is_active: Optional[bool] = Field(None, description="Активен ли пользователь")

class UserResponse(UserBase):
    id: int = Field(..., description="ID пользователя")
    email_confirmed: bool = Field(default=False, description="Подтверждение email")
    is_active: bool = Field(..., description="Активен ли пользователь")
    created_at: datetime = Field(..., description="Дата создания")
    updated_at: datetime = Field(..., description="Дата обновления")

    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    username: str = Field(..., description="Имя пользователя")
    email: EmailStr = Field(..., description="Email")
    first_name: Optional[str] = Field(None, description="Имя")
    last_name: Optional[str] = Field(None, description="Фамилия")
    email_confirmed: bool = Field(..., description="Подтверждение email") 