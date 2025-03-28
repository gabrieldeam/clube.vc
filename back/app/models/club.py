import uuid
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Club(Base):
    __tablename__ = "clubs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    logo = Column(String, nullable=True)
    
    # Relação com o usuário (dono do clube)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="clubs")
    
    # Relação com a categoria
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category = relationship("Category")

    # Relação com o estilo do clube
    style = relationship("ClubStyle", back_populates="club", uselist=False)
    
    # Relação com os itens da loja
    shop_items = relationship("ShopItem", back_populates="club", cascade="all, delete-orphan")
    
    # Relação com posts do blog
    blog_posts = relationship("BlogPost", back_populates="club", cascade="all, delete-orphan")
    
    # Relação com chat direto e em grupo
    direct_messages = relationship("DirectMessage", back_populates="club", cascade="all, delete-orphan")
    group_messages = relationship("GroupMessage", back_populates="club", cascade="all, delete-orphan")
    
    # (Opcional) Relação com planos de assinatura, se necessário
    subscription_plans = relationship("SubscriptionPlan", back_populates="club", cascade="all, delete-orphan")
    
    # (Opcional) Relação com assinaturas do clube
    subscriptions = relationship("ClubSubscription", back_populates="club", cascade="all, delete-orphan")
