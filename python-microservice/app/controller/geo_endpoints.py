from fastapi import APIRouter, HTTPException
from app.models.geo import GeoRequest
from app.services.geo_service import process_geo_data
from app.helpers.error_handler import NotFoundError, InvalidInputError
from app.models.response import ResponseSchema

router = APIRouter()

@router.post("/process_geo")
async def process_geo(request: GeoRequest):
    try:
        geo_request = GeoRequest(**request.dict())

        points = geo_request.points
        results = process_geo_data(points)

        return ResponseSchema(
            success=True,
            message="Results found successfully",
            results=results
        ).model_dump()

    except InvalidInputError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=ResponseSchema(
                success=False,
                message=e.message
            ).model_dump()
        )

    except NotFoundError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=ResponseSchema(
                success=False,
                message=e.message
            ).model_dump()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=ResponseSchema(
                success=False,
                message="Internal Server Error"
            ).model_dump()
        )
