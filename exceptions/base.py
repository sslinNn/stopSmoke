class AppException(Exception):
    """Базовое исключение приложения"""
    def __init__(self, message: str, code: int = 500):
        self.message = message
        self.code = code
        super().__init__(message)

class NotFoundException(AppException):
    """Исключение для случаев, когда ресурс не найден"""
    def __init__(self, message: str):
        super().__init__(message, 404)

class ValidationException(AppException):
    """Исключение для ошибок валидации"""
    def __init__(self, message: str):
        super().__init__(message, 400) 