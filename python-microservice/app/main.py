from fastapi import FastAPI
from app.helpers.error_handler import register_exception_handlers
from app.controller.geo_endpoints import router as geo_router

app = FastAPI()

register_exception_handlers(app)

app.include_router(geo_router)
