import uuid
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class ClubStyle(Base):
    __tablename__ = "club_styles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = Column(UUID(as_uuid=True), ForeignKey("clubs.id"), unique=True, nullable=False)
    title = Column(String, nullable=False)
    short_description = Column(String, nullable=True)
    full_description = Column(Text, nullable=True)
    banner1 = Column(String, nullable=True)
    banner2 = Column(String, nullable=True)
    banner3 = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    secondary_color = Column(String, nullable=True)
    primary_text_color = Column(String, nullable=True)
    secondary_text_color = Column(String, nullable=True)
    video_link = Column(String, nullable=True)
    promo_title = Column(String, nullable=True)
    promo_subtitle = Column(String, nullable=True)
    promo_image = Column(String, nullable=True)
    
    # Relacionamento com os itens de infos
    infos = relationship("ClubStyleInfo", back_populates="club_style", cascade="all, delete-orphan")
    club = relationship("Club", back_populates="style")
