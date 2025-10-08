from pydantic import BaseModel, model_validator, Field, field_validator
from typing import List
from decimal import Decimal

class Point(BaseModel):
    lat: Decimal = Field(..., ge=-90, le=90, description="Latitude between -90 and 90 degrees")
    lng: Decimal = Field(..., ge=-180, le=180, description="Longitude between -180 and 180 degrees")

    @field_validator('lat', 'lng', mode='before')
    def convert_to_decimal(cls, value, info):
        try:
            if isinstance(value, str):
                return Decimal(value)
            return value
        except Exception:
            raise ValueError(f"Invalid decimal value for {info.field_name}: {value}. Expected a valid number.")

    @model_validator(mode="before")
    def check_lat_lng(cls, values):
        lat = values.get('lat', None)
        lng = values.get('lng', None)

        if lat is None and lng is None:
            raise ValueError("'lng' and 'lat' are required and cannot be null or empty.")
        
        if lat is None:
            raise ValueError("'lat' is required and cannot be null or empty.")

        if lng is None:
            raise ValueError("'lng' is required and cannot be null or empty.")
        
        return values

    

    class Config:
        str_min_length = 1 

class GeoRequest(BaseModel):
    points: List[Point]

    @model_validator(mode="before")
    def check_points(cls, values):
        points = values.get('points', None)

        if points is None:
            raise ValueError("The 'points' field is required.")
        
        if not isinstance(points, list):
            raise ValueError("'points' must be an array.")

        if len(points) == 0:
            raise ValueError("The 'points' array cannot be empty.")

        return values
