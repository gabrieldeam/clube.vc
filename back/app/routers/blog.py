import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.blog_post import BlogPost  # Certifique-se de que o caminho esteja correto
from app.schemas.blog_post import BlogPostResponse  # Certifique-se de que o schema esteja correto

router = APIRouter()

# Função auxiliar para salvar o arquivo, igual à usada em outros endpoints
async def save_uploaded_file(upload: UploadFile, upload_dir: str) -> str:
    os.makedirs(upload_dir, exist_ok=True)
    file_name = f"{uuid.uuid4().hex}_{upload.filename}"
    file_path = os.path.join(upload_dir, file_name)
    with open(file_path, "wb") as f:
        f.write(await upload.read())
    # Retorna a URL relativa (por exemplo, /static/blog_images/...)
    return f"/{upload_dir}/{file_name}"

# Função auxiliar para remover arquivo, se existir
def remove_file(file_url: str):
    if file_url:
        file_path = file_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)

# Endpoint para criar um post para um clube específico (com upload de imagem)
@router.post("/clubs/{club_id}/blog/upload", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_club_blog_post(
    club_id: str,
    title: str = Form(...),
    content: str = Form(...),
    subtitle: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    upload_dir = "static/blog_images"
    image_url = await save_uploaded_file(image, upload_dir) if image else None

    novo_post = BlogPost(
        club_id=uuid.UUID(club_id),
        title=title,
        content=content,
        subtitle=subtitle,
        image=image_url,
        created_at=datetime.utcnow()
    )
    db.add(novo_post)
    db.commit()
    db.refresh(novo_post)
    return novo_post

# Endpoint para listar posts de um clube específico
@router.get("/clubs/{club_id}/blog", response_model=list[BlogPostResponse])
async def list_club_blog_posts(club_id: str, db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.club_id == uuid.UUID(club_id)).all()
    return posts

# Endpoint para criar um post fora do contexto do clube
@router.post("/upload", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    club_id: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    subtitle: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    upload_dir = "static/blog_images"
    image_url = await save_uploaded_file(image, upload_dir) if image else None

    novo_post = BlogPost(
        club_id=uuid.UUID(club_id),
        title=title,
        content=content,
        subtitle=subtitle,
        image=image_url,
        created_at=datetime.utcnow()
    )
    db.add(novo_post)
    db.commit()
    db.refresh(novo_post)
    return novo_post

# Endpoint para listar posts fora do contexto do clube
@router.get("/list", response_model=list[BlogPostResponse])
async def list_blog_posts(club_id: str, db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.club_id == uuid.UUID(club_id)).all()
    return posts

@router.get("/clubs/{club_id}/blog", response_model=list[BlogPostResponse])
async def list_club_blog_posts(club_id: str, db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.club_id == uuid.UUID(club_id)).all()
    return posts

# Endpoint para atualizar um post (com upload de imagem)
@router.put("/upload/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    title: str = Form(...),
    content: str = Form(...),
    subtitle: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    post = db.query(BlogPost).filter(BlogPost.id == uuid.UUID(post_id)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    
    post.title = title
    post.content = content
    post.subtitle = subtitle
    if image:
        if post.image:
            remove_file(post.image)
        upload_dir = "static/blog_images"
        post.image = await save_uploaded_file(image, upload_dir)
    db.commit()
    db.refresh(post)
    return post

# Endpoint para deletar um post
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == uuid.UUID(post_id)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    
    if post.image:
        remove_file(post.image)
    db.delete(post)
    db.commit()
    return
