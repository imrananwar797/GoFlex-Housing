import random
from datetime import datetime

class YieldManagementService:
    """
    AI-driven Yield Management Service.
    Adjusts property rent recommendations based on:
    - Seasonal demand (University admission cycles)
    - Local inventory occupancy
    - Market trends
    """
    
    def calculate_recommended_rent(self, base_rent: float, city: str, occupancy_rate: float) -> dict:
        current_month = datetime.now().month
        
        # 1. Seasonality Factor (Peak demand: July-August for students)
        seasonality_multiplier = 1.0
        if current_month in [7, 8]:
            seasonality_multiplier = 1.15 # 15% increase during student peak
        elif current_month in [12, 1]:
            seasonality_multiplier = 0.90 # 10% discount during off-peak
            
        # 2. Scarcity Factor (Low occupancy = higher price)
        scarcity_multiplier = 1.0
        if occupancy_rate > 90:
            scarcity_multiplier = 1.10
        elif occupancy_rate < 40:
            scarcity_multiplier = 0.95
            
        recommended_rent = base_rent * seasonality_multiplier * scarcity_multiplier
        
        # Add some "AI variance" (mocking market volatility)
        variance = random.uniform(0.98, 1.02)
        final_rent = round(recommended_rent * variance, 2)
        
        return {
            "base_rent": base_rent,
            "recommended_rent": final_rent,
            "change_percentage": round(((final_rent - base_rent) / base_rent) * 100, 2),
            "reasoning": self._generate_reasoning(seasonality_multiplier, scarcity_multiplier),
            "timestamp": datetime.now().isoformat()
        }
        
    def _generate_reasoning(self, s_mult, o_mult) -> str:
        reasons = []
        if s_mult > 1: reasons.append("High seasonal demand detected (University admission cycle)")
        if s_mult < 1: reasons.append("Low seasonal demand period")
        if o_mult > 1: reasons.append("Scarcity alert: Local occupancy is >90%")
        if o_mult < 1: reasons.append("Promotional pricing: High local availability")
        
        return " • ".join(reasons) if reasons else "Market stable"

yield_service = YieldManagementService()
