from fastapi import APIRouter, Depends
from api.users.users_utils import get_current_user
from models.User import User

router = APIRouter()


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    user = {
        "username": current_user.username,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email_confirmed": current_user.email_confirmed,
    }
    return user
