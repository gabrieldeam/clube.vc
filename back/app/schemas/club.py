from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class ClubBase(BaseModel):
    name: str = Field(..., description="Nome do clube")
    logo: Optional[str] = Field(None, description="URL do logo")
    category_id: int = Field(..., description="ID da categoria")

class ClubCreate(ClubBase):
    pass

class ClubUpdate(BaseModel):
    name: Optional[str]
    logo: Optional[str]
    category_id: Optional[int]

class ClubResponse(ClubBase):
    id: UUID
    owner_id: UUID
    support_id: str  # Novo campo para visualização

    class Config:
        orm_mode = True
