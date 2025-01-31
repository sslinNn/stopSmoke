from datetime import datetime
from pydantic import EmailStr, constr
from backend.schemas.CoreSchema import CoreSchema

class UserInDBSchema(CoreSchema):
    id: int
    username: str
    password: str
    email: EmailStr
    email_confirmed: bool = False
    is_active: bool = False
    is_superuser: bool = False
    first_name: str = ""
    last_name: str = ""
    created_at: datetime
    updated_at: datetime

class UserCreateSchema(CoreSchema):
    email: EmailStr
    password: constr(min_length=6, max_length=64)

class UserPublicSchema(CoreSchema):
    username: str
    first_name: str and None
    last_name: str and None
    is_active: bool and None


# TODO: UserUpdate for profile update
# TODO: UserPasswordUpdate for user password update
