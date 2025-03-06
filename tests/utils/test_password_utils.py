from passlib.context import CryptContext
from utils.password_utils import (
    get_password_hash,
    password_compare,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password = "Razer1991!"
hashed_password = pwd_context.hash(password)


def test_get_password_hash():
    assert isinstance(get_password_hash(password), str)


def test_password_compare():
    assert isinstance(password_compare(password, hashed_password), bool)
    assert password_compare(password, hashed_password) == True
