from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.schemas.subscription_plan import SubscriptionPlanCreate, SubscriptionPlanResponse
from app.models.subscription_plan import SubscriptionPlan
from app.dependencies import get_current_user

router = APIRouter(
    tags=["SubscriptionPlans"]
)

@router.post("/", response_model=SubscriptionPlanResponse)
def create_subscription_plan(
    plan: SubscriptionPlanCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Cria o plano de assinatura
    subscription_plan = SubscriptionPlan(
        club_id=plan.club_id,
        name=plan.name,
        description=plan.description,
        price=plan.price
    )
    db.add(subscription_plan)
    db.commit()
    db.refresh(subscription_plan)
    
    # Cria os benefícios, se houver
    if plan.benefits:
        from app.models.subscription_benefit import SubscriptionBenefit
        for benefit in plan.benefits:
            sub_benefit = SubscriptionBenefit(
                plan_id=subscription_plan.id,
                benefit=benefit.benefit
            )
            db.add(sub_benefit)
        db.commit()
        db.refresh(subscription_plan)
    return subscription_plan

@router.get("/", response_model=List[SubscriptionPlanResponse])
def list_subscription_plans(
    club_id: str, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """
    Retorna todos os planos de assinatura para o clube informado (club_id).
    Exemplo de URL: GET /subscription_plans/?club_id=<id_do_club>
    """
    plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.club_id == club_id).all()
    return plans

@router.get("/{plan_id}", response_model=SubscriptionPlanResponse)
def get_subscription_plan(
    plan_id: UUID, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """
    Retorna os detalhes de um plano específico, dado o plan_id.
    """
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plano não encontrado"
        )
    return plan

@router.delete("/{plan_id}", response_model=SubscriptionPlanResponse)
def delete_subscription_plan(
    plan_id: UUID, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """
    Deleta um plano de assinatura específico, dado o plan_id.
    """
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plano não encontrado"
        )
    db.delete(plan)
    db.commit()
    return plan

@router.put("/{plan_id}", response_model=SubscriptionPlanResponse)
def update_subscription_plan(
    plan_id: UUID,
    plan: SubscriptionPlanCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Busca o plano pelo ID
    subscription_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not subscription_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plano não encontrado"
        )
    
    # Atualiza os campos básicos do plano
    subscription_plan.name = plan.name
    subscription_plan.description = plan.description
    subscription_plan.price = plan.price
    subscription_plan.club_id = plan.club_id  # Opcional, se desejar permitir alteração
    
    # Atualiza os benefícios:
    # 1. Remove os benefícios atuais
    from app.models.subscription_benefit import SubscriptionBenefit
    existing_benefits = db.query(SubscriptionBenefit).filter(SubscriptionBenefit.plan_id == plan_id).all()
    for benefit in existing_benefits:
        db.delete(benefit)
    db.commit()  # Confirma a remoção

    # 2. Adiciona os novos benefícios, se houver
    if plan.benefits:
        for benefit in plan.benefits:
            new_benefit = SubscriptionBenefit(
                plan_id=subscription_plan.id,
                benefit=benefit.benefit
            )
            db.add(new_benefit)
    db.commit()
    db.refresh(subscription_plan)
    return subscription_plan

