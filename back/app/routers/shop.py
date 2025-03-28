import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.models.shop_item import ShopItem
from app.models.club import Club
from app.schemas.shop_item import ShopItemCreate, ShopItemResponse, ShopItemUpdate
from app.dependencies import get_current_user

router = APIRouter(
    tags=["Shop"]
)

def remove_file(file_url: Optional[str]):
    if file_url:
        file_path = file_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)

async def save_uploaded_file(upload: UploadFile, upload_dir: str) -> str:
    os.makedirs(upload_dir, exist_ok=True)
    file_name = f"{uuid.uuid4().hex}_{upload.filename}"
    file_path = os.path.join(upload_dir, file_name)
    with open(file_path, "wb") as f:
        f.write(await upload.read())
    return f"/{upload_dir}/{file_name}"

@router.post("/upload", response_model=ShopItemResponse)
async def create_shop_item(
    club_id: UUID = Form(..., description="ID do clube"),
    name: str = Form(..., description="Nome do produto"),
    price: float = Form(..., description="Preço do produto"),
    external_link: Optional[str] = Form(None, description="Link externo para mais informações"),
    short_description: Optional[str] = Form(None, description="Descrição curta do produto"),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verifica se o clube existe e pertence ao usuário autenticado
    club = db.query(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado ou acesso negado")
    upload_dir = "static/shop"
    photo_url = await save_uploaded_file(photo, upload_dir) if photo else None
    shop_item = ShopItem(
        club_id=club_id,
        name=name,
        price=price,
        external_link=external_link,
        short_description=short_description,
        photo=photo_url
    )
    db.add(shop_item)
    db.commit()
    db.refresh(shop_item)
    return shop_item

@router.get("/", response_model=List[ShopItemResponse])
def list_shop_items(club_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Verifica se o clube pertence ao usuário para listar os itens
    club = db.query(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado ou acesso negado")
    items = db.query(ShopItem).filter(ShopItem.club_id == club_id).all()
    return items

@router.put("/upload/{item_id}", response_model=ShopItemResponse)
async def update_shop_item(
    item_id: UUID,
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    external_link: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    shop_item = db.query(ShopItem).join(Club).filter(ShopItem.id == item_id, Club.owner_id == current_user.id).first()
    if not shop_item:
        raise HTTPException(status_code=404, detail="Item da loja não encontrado")
    if name:
        shop_item.name = name
    if price:
        shop_item.price = price
    if external_link:
        shop_item.external_link = external_link
    if short_description:
        shop_item.short_description = short_description
    upload_dir = "static/shop"
    if photo:
        remove_file(shop_item.photo)
        shop_item.photo = await save_uploaded_file(photo, upload_dir)
    db.commit()
    db.refresh(shop_item)
    return shop_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shop_item(item_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    shop_item = db.query(ShopItem).join(Club).filter(ShopItem.id == item_id, Club.owner_id == current_user.id).first()
    if not shop_item:
        raise HTTPException(status_code=404, detail="Item da loja não encontrado")
    remove_file(shop_item.photo)
    db.delete(shop_item)
    db.commit()
    return
