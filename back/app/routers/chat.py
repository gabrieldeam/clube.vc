import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.dependencies import get_current_user
from app.models.direct_message import DirectMessage
from app.models.group_message import GroupMessage
from app.schemas.direct_message import DirectMessageCreate, DirectMessageResponse
from app.schemas.group_message import GroupMessageCreate, GroupMessageResponse

router = APIRouter(
    tags=["Chat"]
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

# Chat Direto (entre clube e assinante)
@router.post("/direct/{club_id}", response_model=DirectMessageResponse)
async def send_direct_message(
    club_id: str,
    content: Optional[str] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    from app.models.club import Club
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado")
    receiver_id = club.owner_id if current_user.id != club.owner_id else None
    if receiver_id is None:
        raise HTTPException(status_code=400, detail="Não é possível enviar mensagem direta para si mesmo")
    upload_dir = "static/chat"
    image_url = await save_uploaded_file(image, upload_dir) if image else None
    direct_msg = DirectMessage(
        club_id=club_id,
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content,
        image=image_url
    )
    db.add(direct_msg)
    db.commit()
    db.refresh(direct_msg)
    return direct_msg

@router.get("/direct/{club_id}", response_model=List[DirectMessageResponse])
def get_direct_messages(club_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    from app.models.club import Club
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Clube não encontrado")
    owner_id = club.owner_id
    messages = db.query(DirectMessage).filter(
        DirectMessage.club_id == club_id,
        ((DirectMessage.sender_id == current_user.id) & (DirectMessage.receiver_id == owner_id)) |
        ((DirectMessage.sender_id == owner_id) & (DirectMessage.receiver_id == current_user.id))
    ).order_by(DirectMessage.created_at).all()
    return messages

# Chat em Grupo (conversa entre todos os inscritos e o dono do clube)
@router.post("/group/{club_id}", response_model=GroupMessageResponse)
async def send_group_message(
    club_id: str,
    content: Optional[str] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    upload_dir = "static/chat"
    image_url = await save_uploaded_file(image, upload_dir) if image else None
    group_msg = GroupMessage(
        club_id=club_id,
        sender_id=current_user.id,
        content=content,
        image=image_url
    )
    db.add(group_msg)
    db.commit()
    db.refresh(group_msg)
    return group_msg

@router.get("/group/{club_id}", response_model=List[GroupMessageResponse])
def get_group_messages(club_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    messages = db.query(GroupMessage).filter(GroupMessage.club_id == club_id).order_by(GroupMessage.created_at).all()
    return messages
