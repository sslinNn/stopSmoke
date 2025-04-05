from fastapi import APIRouter

from src.api.auth.auth_router import router as auth_router
from src.api.craving.reasons_router import router as reasons_router
from src.api.craving.craving_router import router as craving_router
from src.api.users.users_router import router as users_router
from src.api.posts.posts_router import router as posts_router
from src.api.posts.categories_router import router as categories_router
from src.api.posts.comments_router import router as comments_router
# from src.api.posts.likes_router import router as likes_router
# from src.api.user_progress.user_progress_router import router as user_progress_router

main_router = APIRouter()

main_router.include_router(auth_router, prefix="/auth", tags=["🤝🏻 Authentication"])
main_router.include_router(users_router, prefix="/users", tags=["👨🏻‍🦲 Users"])
main_router.include_router(posts_router, prefix='/posts', tags=["📃 Posts"])
main_router.include_router(comments_router, prefix='/posts/comments', tags=["💬 Comments"])
# main_router.include_router(likes_router, prefix='/posts/likes', tags=["👍 Posts likes"])
main_router.include_router(categories_router, prefix='/posts/categories', tags=["🐱 Posts categories"])

# main_router.include_router(user_progress_router, prefix="/progress", tags=["🎉 Progress"])
main_router.include_router(craving_router, prefix="/cravings", tags=["👞 Cravings"])
main_router.include_router(reasons_router, prefix="/cravings/reasons", tags=["🧲 Craving reasons"])