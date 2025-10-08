from pydantic import BaseModel, Field
from typing import Optional

class ResponseSchema(BaseModel):
    """Esquema de respuesta estándar para la API."""
    
    success: bool = True
    message: str = Field(..., description="Message of the response")
    results: Optional[dict] = {}  