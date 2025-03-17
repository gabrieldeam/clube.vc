import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.blog_post import BlogPost
from app.schemas.blog_post import BlogPostCreate, BlogPostResponse
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/blog",
    tags=["Blog"]
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

@router.post("/upload", response_model=BlogPostResponse)
async def create_blog_post(
    club_id: str = Form(...),
    title: str = Form(...),
    subtitle: Optional[str] = Form(None),
    content: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    upload_dir = "static/blog"
    image_url = await save_uploaded_file(image, upload_dir) if image else None
    blog_post = BlogPost(
        club_id=club_id,
        title=title,
        subtitle=subtitle,
        content=content,
        image=image_url
    )
    db.add(blog_post)
    db.commit()
    db.refresh(blog_post)
    return blog_post

@router.get("/", response_model=List[BlogPostResponse])
def list_blog_posts(club_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    posts = db.query(BlogPost).filter(BlogPost.club_id == club_id).all()
    return posts

@router.put("/upload/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    title: str = Form(...),
    subtitle: Optional[str] = Form(None),
    content: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    blog_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not blog_post:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    blog_post.title = title
    blog_post.subtitle = subtitle
    blog_post.content = content
    upload_dir = "static/blog"
    if image:
        remove_file(blog_post.image)
        blog_post.image = await save_uploaded_file(image, upload_dir)
    db.commit()
    db.refresh(blog_post)
    return blog_post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog_post(post_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    blog_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not blog_post:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    remove_file(blog_post.image)
    db.delete(blog_post)
    db.commit()
    return
