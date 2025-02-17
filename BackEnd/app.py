import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_users import fastapi_users

from backend.api.auth.router import router as auth_router

# from backend.api.users.router import router as users_router
sys.path.append("..")
app = FastAPI(title="Party Finder")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Rоутеры
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
