from datetime import datetime
from typing import Optional

from pydantic import EmailStr, Field
from pydantic.v1 import validator

from schemas.CoreSchema import CoreSchema


class SUserBase(CoreSchema):
    email: EmailStr = Field(
        ...,
        description="Email address",
        pattern=r"^[^а-яА-ЯёЁ]*$",
    )


class SUserRegister(SUserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="Password",
        pattern=r"^[^а-яА-ЯёЁ]*$",
    )
    password_repeat: str = Field()

    @validator("password_repeat")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("Пароли не совпадают.")
        return v


class SUserLogin(SUserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="User password",
        pattern=r"^[^а-яА-ЯёЁ]*$",
    )


class SUserOut(CoreSchema):
    id: int = Field(..., description="User unique ID")
    email: EmailStr = Field(..., description="User email")
    username: str = Field(..., description="Username")
    created_at: datetime = Field(..., description="Datetime creation of user")

    class Config:
        from_attributes = True


class UserUpdate(CoreSchema):
    username: Optional[str] = None
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None