from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class ClubStyleInfoBase(BaseModel):
    info_title: str = Field(..., description="Título da informação")
    info_content: str = Field(..., description="Conteúdo da informação")

class ClubStyleInfoCreate(ClubStyleInfoBase):
    pass

class ClubStyleInfoResponse(ClubStyleInfoBase):
    id: int

    class Config:
        orm_mode = True

class ClubStyleBase(BaseModel):
    title: str = Field(..., description="Título do estilo")
    short_description: Optional[str] = Field(None, description="Descrição curta")
    full_description: Optional[str] = Field(None, description="Descrição completa")
    primary_color: Optional[str] = Field(None, description="Cor primária (ex.: #FFFFFF)")
    secondary_color: Optional[str] = Field(None, description="Cor secundária (ex.: #000000)")
    primary_text_color: Optional[str] = Field(None, description="Cor do texto primário (ex.: #333333)")
    secondary_text_color: Optional[str] = Field(None, description="Cor do texto secundário (ex.: #666666)")
    video_link: Optional[str] = Field(None, description="Link para vídeo")
    promo_title: Optional[str] = Field(None, description="Título promocional")
    promo_subtitle: Optional[str] = Field(None, description="Subtítulo promocional")

class ClubStyleCreate(ClubStyleBase):
    club_id: UUID = Field(..., description="ID do clube associado")
    infos: Optional[List[ClubStyleInfoCreate]] = None

class ClubStyleUpdate(ClubStyleBase):
    infos: Optional[List[ClubStyleInfoCreate]] = None

class ClubStyleResponse(ClubStyleBase):
    id: UUID
    club_id: UUID
    banner1: Optional[str] = None
    banner2: Optional[str] = None
    banner3: Optional[str] = None
    promo_image: Optional[str] = None
    infos: List[ClubStyleInfoResponse] = []

    class Config:
        orm_mode = True
