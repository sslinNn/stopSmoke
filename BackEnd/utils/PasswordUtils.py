from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Хеширует пароль с использованием bcrypt."""
    return pwd_context.hash(password)


def password_compare(plain_password: str, hashed_password: str) -> bool:
    """Сравнивает пароль с хешированным значением."""
    return pwd_context.verify(plain_password, hashed_password)
