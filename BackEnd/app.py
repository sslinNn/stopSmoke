import uvicorn
from fastapi import FastAPI, Body
import os
from dotenv import load_dotenv
from fastapi_sqlalchemy import DBSessionMiddleware, db
from starlette.middleware.cors import CORSMiddleware

from models.User import User
from models.schemas import UserSchema

# Load environment variables
load_dotenv()
db_url = os.getenv('DATABASE_URL')

if not db_url:
    raise ValueError("DATABASE_URL is not set in the .env file")

app = FastAPI()
app.add_middleware(DBSessionMiddleware, db_url=db_url)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Или укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import logging

logging.basicConfig(level=logging.INFO)

@app.get('/')
def read_root():
    print("Маршрут вызван!")
    logging.info(f"root upload")
    return {"Hello": "World"}

@app.post('/user/', response_model=UserSchema.CreateUser)
def create_user(user: UserSchema.CreateUser):
    db_user = User(
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        password=user.password
    )
    db.session.add(db_user)
    db.session.commit()
    return db_user


if __name__ == '__main__':
    uvicorn.run(app, port=8000)
