from pydantic import Field, EmailStr, validator
from src.schemas.core_schema import CoreSchema


class SAuthBase(CoreSchema):
    email: EmailStr = Field(..., description="Email адрес пользователя")
    password: str = Field(
        ...,
        min_length=6,
        max_length=26,
        pattern=r"^[^а-яА-ЯёЁ]*$",
        description="Пароль пользователя",
    )

class SAuthRegisterClient(SAuthBase):
    password_repeat: str = Field(..., description="Повторение пароля")

    @validator("password_repeat")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Пароли не совпадают")
        return v


class SAuthRegisterServer(SAuthRegisterClient):
    username: str = Field(..., pattern=r"^[^а-яА-ЯёЁ]*$", description="Username пользователя")
