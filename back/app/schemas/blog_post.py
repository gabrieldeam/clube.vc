from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class BlogPostBase(BaseModel):
    title: str = Field(..., description="Título do post")
    subtitle: Optional[str] = Field(None, description="Subtítulo do post")
    content: str = Field(..., description="Conteúdo do post")

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: UUID
    club_id: UUID
    image: Optional[str] = Field(None, description="URL da imagem")
    created_at: datetime

    class Config:
        orm_mode = True
