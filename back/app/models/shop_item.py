import uuid
from sqlalchemy import Column, String, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class ShopItem(Base):
    __tablename__ = "shop_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = Column(UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=False)
    photo = Column(String, nullable=True)
    name = Column(String, nullable=False)
    price = Column(Numeric(10,2), nullable=False)
    external_link = Column(String, nullable=True)
    short_description = Column(String, nullable=True)
    
    club = relationship("Club", back_populates="shop_items")
