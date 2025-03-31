from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from app.schemas.subscription_benefit import SubscriptionBenefitResponse, SubscriptionBenefitCreate

class SubscriptionPlanBase(BaseModel):
    name: str = Field(..., description="Nome do plano")
    description: Optional[str] = Field(None, description="Descrição do plano")
    price: float = Field(..., description="Preço do plano")

class SubscriptionPlanCreate(SubscriptionPlanBase):
    club_id: UUID  # Adicione essa linha
    benefits: Optional[List[SubscriptionBenefitCreate]] = None

class SubscriptionPlanResponse(SubscriptionPlanBase):
    id: UUID
    benefits: List[SubscriptionBenefitResponse] = []

    class Config:
        orm_mode = True
