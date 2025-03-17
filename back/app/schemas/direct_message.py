from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class DirectMessageBase(BaseModel):
    content: Optional[str] = Field(None, description="Conteúdo da mensagem")

class DirectMessageCreate(DirectMessageBase):
    receiver_id: UUID

class DirectMessageResponse(DirectMessageBase):
    id: UUID
    club_id: UUID
    sender_id: UUID
    receiver_id: UUID
    image: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
