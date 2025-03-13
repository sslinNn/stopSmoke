from src.exceptions.base import NotFoundException


class UserNotFoundException(NotFoundException):
    """Исключение для случаев, когда пользователь не найден"""

    def __init__(self, message: str = "Пользователь не найден"):
        super().__init__(message)


class UserAlreadyExistsException(NotFoundException):
    """Исключение для случаев, когда пользователь уже существует"""

    def __init__(self, message: str = "Пользователь с таким email уже существует"):
        super().__init__(message)
