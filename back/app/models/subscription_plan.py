import uuid
from sqlalchemy import Column, String, Numeric, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = Column(UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10,2), nullable=False)
    
    benefits = relationship("SubscriptionBenefit", back_populates="plan", cascade="all, delete-orphan")
