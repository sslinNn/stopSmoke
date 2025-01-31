import re
from datetime import datetime
from typing import Optional

from pydantic import EmailStr, Field, field_validator

from backend.schemas.CoreSchema import CoreSchema


class SUser(CoreSchema):
    username: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Can use only latin symbols, numbers, and underscores",
    )

    @field_validator("username")
    def validate_username(cls, v):
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError(
                "Username can only contain latin letters, numbers, and underscores"
            )
        return v


class SUserRegister(CoreSchema):
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(
        ...,
        min_length=5,
        max_length=50,
        description="Password from 5 to 50 symbols must have 1 letter and 1 number",
    )
    password_confirmation: str
    created_at: Optional[datetime] = datetime.utcnow()

    @field_validator("password")
    def validate_password(cls, v):
        if not any(char.isalpha() for char in v):  # Проверка на наличие буквы
            raise ValueError("Password must contain at least one letter")
        if not any(char.isdigit() for char in v):  # Проверка на наличие цифры
            raise ValueError("Password must contain at least one number")
        return v


# TODO: UserUpdate for profile update
# TODO: UserPasswordUpdate for user password update
