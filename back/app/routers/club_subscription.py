from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.schemas.club_subscription import ClubSubscriptionCreate, ClubSubscriptionResponse
from app.models.club_subscription import ClubSubscription
from app.dependencies import get_current_user
from app.email.send_email import send_subscription_email

router = APIRouter(
    prefix="/club_subscriptions",
    tags=["ClubSubscriptions"]
)

@router.post("/", response_model=ClubSubscriptionResponse)
def subscribe_to_club(subscription: ClubSubscriptionCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    club_subscription = ClubSubscription(
        club_id=subscription.club_id,
        plan_id=subscription.plan_id,
        user_id=current_user.id
    )
    db.add(club_subscription)
    db.commit()
    db.refresh(club_subscription)
    
    # Envia e-mail de boas-vindas com template HTML
    try:
        send_subscription_email(current_user.email, current_user.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao enviar e-mail: " + str(e))
    
    return club_subscription

@router.delete("/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsubscribe_from_club(subscription_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    subscription = db.query(ClubSubscription).filter(
        ClubSubscription.id == subscription_id,
        ClubSubscription.user_id == current_user.id
    ).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Inscrição não encontrada ou acesso negado")
    db.delete(subscription)
    db.commit()
    return