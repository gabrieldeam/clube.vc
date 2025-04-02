import uuid
import string
import random
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

def generate_support_id(length=6):
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

class Club(Base):
    __tablename__ = "clubs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    logo = Column(String, nullable=True)
    
    # Novo campo support_id, gerado automaticamente
    support_id = Column(String(6), unique=True, default=generate_support_id)
    
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="clubs")
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category = relationship("Category")

    style = relationship("ClubStyle", back_populates="club", uselist=False)
    
    shop_items = relationship("ShopItem", back_populates="club", cascade="all, delete-orphan")
    blog_posts = relationship("BlogPost", back_populates="club", cascade="all, delete-orphan")
    direct_messages = relationship("DirectMessage", back_populates="club", cascade="all, delete-orphan")
    group_messages = relationship("GroupMessage", back_populates="club", cascade="all, delete-orphan")
    subscription_plans = relationship("SubscriptionPlan", back_populates="club", cascade="all, delete-orphan")
    subscriptions = relationship("ClubSubscription", back_populates="club", cascade="all, delete-orphan")
