from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class SubscriptionBenefit(Base):
    __tablename__ = "subscription_benefits"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("subscription_plans.id"), nullable=False)
    benefit = Column(String, nullable=False)
    
    plan = relationship("SubscriptionPlan", back_populates="benefits")
