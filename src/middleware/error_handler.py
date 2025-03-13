import logging
from logging import Logger
from fastapi import Request
from fastapi.responses import JSONResponse
from src.exceptions.base import AppException

logger: Logger = logging.getLogger(__name__)

async def error_handler(request: Request, call_next):
    try:
        logger.info(f"Входящий запрос: {request.method} {request.url}")
        response = await call_next(request)
        logger.info(f"Исходящий ответ: {response.status_code}")
        return response
        
    except AppException as e:
        logger.warning(f"Обработанное исключение: {str(e)}")
        return JSONResponse(
            status_code=e.code,
            content={"detail": e.message}
        )
    except Exception as e:
        logger.error(f"Необработанное исключение: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Внутренняя ошибка сервера"}
        ) 