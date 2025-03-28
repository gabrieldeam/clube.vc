from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.models.category import Category
from app.dependencies import get_current_admin, get_current_user

router = APIRouter(
    tags=["Categories"]
)

@router.post("/", response_model=CategoryResponse, dependencies=[Depends(get_current_admin)])
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    # Verifica se a categoria já existe
    existing = db.query(Category).filter(Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria já existe")
    new_category = Category(name=category.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    categories = db.query(Category).all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return category

@router.put("/{category_id}", response_model=CategoryResponse, dependencies=[Depends(get_current_admin)])
def update_category(category_id: int, category_data: CategoryUpdate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    if category_data.name is not None:
        category.name = category_data.name
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    db.delete(category)
    db.commit()
    return
