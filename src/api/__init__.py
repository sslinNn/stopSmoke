from fastapi import APIRouter

from src.api.auth.auth_router import router as auth_router
from src.api.users.users_router import router as users_router

main_router = APIRouter()

main_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
main_router.include_router(users_router, prefix="/users", tags=["Users"])
