from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    class Config:
        from_attributes = True


class CreateUser(UserBase):
    password: str

    class Config:
        from_attributes = True


class UserSchema(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
