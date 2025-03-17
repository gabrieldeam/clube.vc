from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from decimal import Decimal

class ShopItemBase(BaseModel):
    name: str = Field(..., description="Nome do produto")
    price: Decimal = Field(..., description="Preço do produto")
    external_link: Optional[str] = Field(None, description="Link externo para compra ou mais informações")
    short_description: Optional[str] = Field(None, description="Descrição curta do produto")

class ShopItemCreate(ShopItemBase):
    club_id: UUID

class ShopItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    external_link: Optional[str] = None
    short_description: Optional[str] = None

class ShopItemResponse(ShopItemBase):
    id: UUID
    club_id: UUID
    photo: Optional[str] = None

    class Config:
        orm_mode = True
