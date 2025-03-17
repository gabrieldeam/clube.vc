from pydantic import BaseModel, Field
from typing import Optional

class CategoryBase(BaseModel):
    name: str = Field(..., description="Nome da categoria")

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str]

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True
