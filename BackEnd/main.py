import logging
import sys

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.users.router import router as users_router

sys.path.append('..')

app = FastAPI(title="Party Finder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rоутеры
app.include_router(users_router, prefix="/api/v1/users")

logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':
    uvicorn.run("main:app", port=8000, reload=True)
