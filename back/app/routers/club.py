import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.club import ClubResponse
from app.models.club import Club
from app.dependencies import get_current_user

router = APIRouter(
    tags=["Clubs"]
)

# Novo endpoint para criação de clube com upload de logo
@router.post("/upload", response_model=ClubResponse)
async def create_club_upload(
    name: str = Form(..., description="Nome do clube"),
    category_id: int = Form(..., description="ID da categoria"),
    logo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Processa o upload do arquivo, se fornecido
    logo_url = None
    if logo:
        # Cria o diretório para armazenar logos, se não existir
        upload_dir = "static/logos"
        os.makedirs(upload_dir, exist_ok=True)
        # Define um nome único para o arquivo (pode ser ajustado conforme a necessidade)
        file_name = f"{current_user.id}_{uuid.uuid4().hex}_{logo.filename}"
        file_location = os.path.join(upload_dir, file_name)
        # Salva o arquivo no disco
        with open(file_location, "wb") as f:
            f.write(await logo.read())
        # Aqui você pode configurar a URL pública (exemplo, se estiver servindo os arquivos estáticos)
        logo_url = f"/static/logos/{file_name}"
    
    new_club = Club(
        name=name,
        logo=logo_url,
        category_id=category_id,
        owner_id=current_user.id
    )
    db.add(new_club)
    db.commit()
    db.refresh(new_club)
    return new_club

# Mantemos também os demais endpoints para listagem, consulta, atualização e exclusão
# @router.get("/", response_model=List[ClubResponse])
# def list_clubs(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
#     clubs = db.query(Club).filter(Club.owner_id == current_user.id).all()
#     return clubs

# @router.get("/{club_id}", response_model=ClubResponse)
# def get_club(club_id: uuid.UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
#     club = db.query(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
#     if not club:
#         raise HTTPException(status_code=404, detail="Clube não encontrado")
#     return club

@router.get("/", response_model=List[ClubResponse])
def list_clubs(db: Session = Depends(get_db)):
    clubs = db.query(Club).all()
    return clubs

@router.get("/{club_id}", response_model=ClubResponse)
def get_club(club_id: uuid.UUID, db: Session = Depends(get_db)):
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado")
    return club


# Endpoint para atualização do clube com upload de logo
@router.put("/upload/{club_id}", response_model=ClubResponse)
async def update_club_upload(
    club_id: uuid.UUID,
    name: str = Form(..., description="Nome do clube"),
    category_id: int = Form(..., description="ID da categoria"),
    logo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    club = db.query(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado")
    
    # Se um novo arquivo de logo for enviado, remova o antigo
    if logo:
        if club.logo:
            # Remove a barra inicial, se houver, para construir o caminho correto
            old_logo_path = club.logo.lstrip("/")
            if os.path.exists(old_logo_path):
                os.remove(old_logo_path)
        # Processa o upload do novo arquivo
        upload_dir = "static/logos"
        os.makedirs(upload_dir, exist_ok=True)
        file_name = f"{current_user.id}_{uuid.uuid4().hex}_{logo.filename}"
        file_location = os.path.join(upload_dir, file_name)
        with open(file_location, "wb") as f:
            f.write(await logo.read())
        club.logo = f"/static/logos/{file_name}"
    
    # Atualiza os demais campos
    club.name = name
    club.category_id = category_id
    db.commit()
    db.refresh(club)
    return club

@router.delete("/{club_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_club(club_id: uuid.UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    club = db.query(Club).filter(Club.id == club_id, Club.owner_id == current_user.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado")
    
    # Se o clube tiver um logo, remove o arquivo do disco
    if club.logo:
        old_logo_path = club.logo.lstrip("/")
        if os.path.exists(old_logo_path):
            os.remove(old_logo_path)
    
    db.delete(club)
    db.commit()
    return