from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.subscription_plan import SubscriptionPlanCreate, SubscriptionPlanResponse
from app.models.subscription_plan import SubscriptionPlan
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/subscription_plans",
    tags=["SubscriptionPlans"]
)

@router.post("/", response_model=SubscriptionPlanResponse)
def create_subscription_plan(plan: SubscriptionPlanCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Aqui, é esperado que o plano seja criado pelo proprietário do clube
    subscription_plan = SubscriptionPlan(
        club_id=plan.club_id,
        name=plan.name,
        description=plan.description,
        price=plan.price
    )
    db.add(subscription_plan)
    db.commit()
    db.refresh(subscription_plan)
    if plan.benefits:
        for benefit in plan.benefits:
            from app.models.subscription_benefit import SubscriptionBenefit
            sub_benefit = SubscriptionBenefit(
                plan_id=subscription_plan.id,
                benefit=benefit.benefit
            )
            db.add(sub_benefit)
        db.commit()
        db.refresh(subscription_plan)
    return subscription_plan

@router.get("/", response_model=List[SubscriptionPlanResponse])
def list_subscription_plans(club_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.club_id == club_id).all()
    return plans
