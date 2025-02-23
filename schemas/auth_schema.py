from pydantic import Field, EmailStr, validator
from schemas.core_schema import CoreSchema

class AuthBase(CoreSchema):
    email: EmailStr = Field(..., description="Email пользователя")

class AuthRegister(AuthBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="Пароль пользователя",
        pattern=r"^[^а-яА-ЯёЁ]*$"
    )
    password_repeat: str = Field(..., description="Повторение пароля")

    @validator("password_repeat")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Пароли не совпадают")
        return v

class AuthLogin(AuthBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        description="Пароль пользователя"
    )