from fastapi import APIRouter, Query
from app.services.yield_management import yield_service

router = APIRouter(prefix="/api/pricing", tags=["pricing"])

@router.get("/recommend")
async def get_rent_recommendation(
    base_rent: float = Query(...),
    city: str = Query(...),
    occupancy_rate: float = Query(...)
):
    """
    Get AI-driven rent recommendation for a property
    """
    result = yield_service.calculate_recommended_rent(base_rent, city, occupancy_rate)
    return result
