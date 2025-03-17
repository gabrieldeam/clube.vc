from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class ClubSubscriptionBase(BaseModel):
    club_id: UUID
    plan_id: UUID

class ClubSubscriptionCreate(ClubSubscriptionBase):
    pass

class ClubSubscriptionResponse(ClubSubscriptionBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
