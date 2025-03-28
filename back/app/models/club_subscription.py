import uuid
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ClubSubscription(Base):
    __tablename__ = "club_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = Column(UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("subscription_plans.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    club = relationship("Club", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
    # Relacionamento com User pode ser definido se necessário:
    # user = relationship("User", back_populates="subscriptions")
