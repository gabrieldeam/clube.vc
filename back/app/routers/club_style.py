import os
import uuid
import json
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.database import get_db
from app.models.club_style import ClubStyle
from app.models.club_style_info import ClubStyleInfo
from app.models.club import Club
from app.dependencies import get_current_user
from app.schemas.club_style import ClubStyleResponse
from fastapi.staticfiles import StaticFiles

router = APIRouter(
    tags=["ClubStyles"]
)

# Função auxiliar para salvar arquivo
async def save_uploaded_file(upload: UploadFile, upload_dir: str) -> str:
    os.makedirs(upload_dir, exist_ok=True)
    file_name = f"{uuid.uuid4().hex}_{upload.filename}"
    file_path = os.path.join(upload_dir, file_name)
    with open(file_path, "wb") as f:
        f.write(await upload.read())
    # Retorna a URL relativa (exemplo: /static/club_styles/...)
    return f"/{upload_dir}/{file_name}"

# Função auxiliar para remover arquivo se existir
def remove_file(file_url: Optional[str]):
    if file_url:
        file_path = file_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/upload", response_model=ClubStyleResponse)
async def create_club_style(
    club_id: UUID = Form(..., description="ID do clube associado"),
    title: str = Form(...),
    short_description: Optional[str] = Form(None),
    full_description: Optional[str] = Form(None),
    primary_color: Optional[str] = Form(None),
    secondary_color: Optional[str] = Form(None),
    primary_text_color: Optional[str] = Form(None),
    secondary_text_color: Optional[str] = Form(None),
    video_link: Optional[str] = Form(None),
    promo_title: Optional[str] = Form(None),
    promo_subtitle: Optional[str] = Form(None),
    infos: Optional[str] = Form(None, description="JSON com lista de infos, ex.: [{\"info_title\": \"X\", \"info_content\": \"Y\"}]"),
    banner1: UploadFile = File(None),
    banner2: UploadFile = File(None),
    banner3: UploadFile = File(None),
    promo_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verifica se o clube existe e pertence ao usuário autenticado
    club = db.query(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado ou acesso negado")
    
    upload_dir = "static/club_styles"
    banner1_url = await save_uploaded_file(banner1, upload_dir) if banner1 else None
    banner2_url = await save_uploaded_file(banner2, upload_dir) if banner2 else None
    banner3_url = await save_uploaded_file(banner3, upload_dir) if banner3 else None
    promo_image_url = await save_uploaded_file(promo_image, upload_dir) if promo_image else None

    club_style = ClubStyle(
        club_id=club_id,
        title=title,
        short_description=short_description,
        full_description=full_description,
        banner1=banner1_url,
        banner2=banner2_url,
        banner3=banner3_url,
        primary_color=primary_color,
        secondary_color=secondary_color,
        primary_text_color=primary_text_color,
        secondary_text_color=secondary_text_color,
        video_link=video_link,
        promo_title=promo_title,
        promo_subtitle=promo_subtitle,
        promo_image=promo_image_url
    )
    db.add(club_style)
    db.commit()
    db.refresh(club_style)

    # Processa a lista de infos, se fornecida
    if infos:
        try:
            infos_list = json.loads(infos)
            for info in infos_list:
                club_info = ClubStyleInfo(
                    club_style_id=club_style.id,
                    info_title=info.get("info_title"),
                    info_content=info.get("info_content")
                )
                db.add(club_info)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=400, detail="Erro ao processar infos: " + str(e))
    
    db.refresh(club_style)
    return club_style

@router.get("/{club_id}", response_model=ClubStyleResponse)
def get_club_style(club_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    club_style = db.query(ClubStyle).join(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
    if not club_style:
        raise HTTPException(status_code=404, detail="Estilo do clube não encontrado")
    return club_style

@router.put("/upload/{style_id}", response_model=ClubStyleResponse)
async def update_club_style(
    style_id: UUID,
    title: str = Form(...),
    short_description: Optional[str] = Form(None),
    full_description: Optional[str] = Form(None),
    primary_color: Optional[str] = Form(None),
    secondary_color: Optional[str] = Form(None),
    primary_text_color: Optional[str] = Form(None),
    secondary_text_color: Optional[str] = Form(None),
    video_link: Optional[str] = Form(None),
    promo_title: Optional[str] = Form(None),
    promo_subtitle: Optional[str] = Form(None),
    infos: Optional[str] = Form(None, description="JSON com lista de infos"),
    banner1: UploadFile = File(None),
    banner2: UploadFile = File(None),
    banner3: UploadFile = File(None),
    promo_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    club_style = db.query(ClubStyle).join(Club).filter(ClubStyle.id == style_id, Club.owner_id == current_user.id).first()
    if not club_style:
        raise HTTPException(status_code=404, detail="Estilo do clube não encontrado")
    
    club_style.title = title
    club_style.short_description = short_description
    club_style.full_description = full_description
    club_style.primary_color = primary_color
    club_style.secondary_color = secondary_color
    club_style.primary_text_color = primary_text_color
    club_style.secondary_text_color = secondary_text_color
    club_style.video_link = video_link
    club_style.promo_title = promo_title
    club_style.promo_subtitle = promo_subtitle

    upload_dir = "static/club_styles"
    if banner1:
        remove_file(club_style.banner1)
        club_style.banner1 = await save_uploaded_file(banner1, upload_dir)
    if banner2:
        remove_file(club_style.banner2)
        club_style.banner2 = await save_uploaded_file(banner2, upload_dir)
    if banner3:
        remove_file(club_style.banner3)
        club_style.banner3 = await save_uploaded_file(banner3, upload_dir)
    if promo_image:
        remove_file(club_style.promo_image)
        club_style.promo_image = await save_uploaded_file(promo_image, upload_dir)
    
    if infos:
        try:
            infos_list = json.loads(infos)
            # Remove infos existentes e insere as novas
            club_style.infos.clear()
            db.commit()
            for info in infos_list:
                club_info = ClubStyleInfo(
                    club_style_id=club_style.id,
                    info_title=info.get("info_title"),
                    info_content=info.get("info_content")
                )
                db.add(club_info)
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=400, detail="Erro ao processar infos: " + str(e))
    
    db.commit()
    db.refresh(club_style)
    return club_style

@router.delete("/{style_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_club_style(style_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    club_style = db.query(ClubStyle).join(Club).filter(ClubStyle.id == style_id, Club.owner_id == current_user.id).first()
    if not club_style:
        raise HTTPException(status_code=404, detail="Estilo do clube não encontrado")
    
    # Remove os arquivos de imagem do disco
    remove_file(club_style.banner1)
    remove_file(club_style.banner2)
    remove_file(club_style.banner3)
    remove_file(club_style.promo_image)
    
    db.delete(club_style)
    db.commit()
    return
