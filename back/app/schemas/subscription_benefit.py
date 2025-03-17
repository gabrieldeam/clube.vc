from pydantic import BaseModel, Field

class SubscriptionBenefitBase(BaseModel):
    benefit: str = Field(..., description="Benefício do plano")

class SubscriptionBenefitCreate(SubscriptionBenefitBase):
    pass

class SubscriptionBenefitResponse(SubscriptionBenefitBase):
    id: int

    class Config:
        orm_mode = True
