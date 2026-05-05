from typing import List, Optional

from pydantic import BaseModel


class PropertyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    city: str
    state: str
    address: str
    monthly_price: float
    beds: int = 1
    baths: int = 1
    amenities: Optional[List[str]] = None
