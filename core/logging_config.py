import os
from pathlib import Path
from typing import Dict, Any

def get_logging_config() -> Dict[str, Any]:
    BASE_DIR = Path(__file__).resolve().parent.parent
    LOG_DIR = BASE_DIR / "logs"
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "access": {
                "format": "%(asctime)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "level": "INFO",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": str(LOG_DIR / "app.log"),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "formatter": "default",
                "encoding": "utf-8",
            },
            "access_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": str(LOG_DIR / "access.log"),
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "formatter": "access",
                "encoding": "utf-8",
            }
        },
        "loggers": {
            "": {  # root logger
                "handlers": ["console", "file"],
                "level": "INFO",
            },
            "uvicorn.access": {  # доступ к эндпоинтам
                "handlers": ["access_file"],
                "level": "INFO",
                "propagate": False
            },
            "sqlalchemy.engine": {  # SQL логи
                "handlers": ["file"],
                "level": "WARNING",
                "propagate": False
            }
        }
    }

LOGGING_CONFIG = get_logging_config() 