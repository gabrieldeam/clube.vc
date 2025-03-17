from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ClubStyleInfo(Base):
    __tablename__ = "club_style_infos"
    
    id = Column(Integer, primary_key=True, index=True)
    club_style_id = Column("club_style_id", ForeignKey("club_styles.id"), nullable=False)
    info_title = Column(String, nullable=False)
    info_content = Column(String, nullable=False)
    
    club_style = relationship("ClubStyle", back_populates="infos")
