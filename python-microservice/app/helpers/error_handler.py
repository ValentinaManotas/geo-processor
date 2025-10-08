import logging
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from app.models.response import ResponseSchema

logger = logging.getLogger(__name__)

class HandleError(Exception):
    """Base class for custom exceptions."""
    message: str
    status_code: int = 500

    def __init__(self, message: str, status_code: int | None = None):
        self.message = message
        if status_code:
            self.status_code = status_code
        super().__init__(self.message)


class NotFoundError(HandleError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class InvalidInputError(HandleError):
    def __init__(self, message: str = "Invalid input provided"):
        super().__init__(message, status_code=400)


class UnauthorizedError(HandleError):
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message, status_code=401)


async def custom_error_handler(_request: Request, exc: HandleError) -> JSONResponse:
    """Manejo de excepciones personalizadas y retorno de respuesta estandarizada."""
    logger.warning(f"Custom API Exception: {exc.__class__.__name__} - {exc.message}", exc_info=True)

    response_content = ResponseSchema(
        success=False,
        message=exc.message,
    ).model_dump()

    return JSONResponse(status_code=exc.status_code, content=response_content)


async def validation_exception_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
    """Manejo de errores de validación de Pydantic."""
    
    error_details = []

    if exc.errors():
        for error in exc.errors():
            field_name = error.get('loc')[-1]
            error_message = error.get('msg')
            error_details.append(f"Field '{field_name}' has error: {error_message}")

    content = ResponseSchema(
        success=False,
        message="; ".join(error_details),
    ).model_dump()

    return JSONResponse(status_code=400, content=content)


def register_exception_handlers(app: FastAPI) -> None:
    """Registrar manejadores de excepciones personalizados."""
    app.add_exception_handler(HandleError, custom_error_handler) 
    app.add_exception_handler(RequestValidationError, validation_exception_handler)

