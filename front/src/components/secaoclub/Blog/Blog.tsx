"use client";

import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  DragEvent,
  ChangeEvent,
} from "react";
import styles from "./Blog.module.css";
import {
  listBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/services/blog";
import { BlogPostResponse, BlogPostCreate } from "@/types/blog";
import Image from "next/image";
// URL do backend para compor a URL completa da imagem
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface BlogSectionProps {
  clubId: string;
}

export default function BlogSection({ clubId }: BlogSectionProps) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [posts, setPosts] = useState<BlogPostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPostResponse | null>(null);

  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await listBlogPosts(clubId);
      // Atualiza a URL da imagem para a URL completa do backend
      const updatedData = data.map((post) =>
        post.image ? { ...post, image: `${backendUrl}${post.image}` } : post
      );
      setPosts(updatedData);
    } catch (error) {
      console.error("Erro ao listar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [clubId]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("club_id", clubId);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await createBlogPost(formData);
      alert("Post criado com sucesso!");
      resetForm();
      setView("list");
      fetchPosts();
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  const handleUpdatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      const formData = new FormData();
      formData.append("club_id", clubId);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await updateBlogPost(editingPost.id, formData);
      alert("Post atualizado com sucesso!");
      resetForm();
      setView("list");
      fetchPosts();
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!editingPost) return;
    if (!confirm("Tem certeza que deseja deletar este post?")) return;
    try {
      await deleteBlogPost(editingPost.id);
      alert("Post deletado com sucesso!");
      resetForm();
      setView("list");
      fetchPosts();
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };

  const startEditing = (post: BlogPostResponse) => {
    setEditingPost(post);
    setTitle(post.title);
    setSubtitle(post.subtitle || "");
    setContent(post.content);
    setImageFile(null);
    setView("edit");
  };

  const resetForm = () => {
    setEditingPost(null);
    setTitle("");
    setSubtitle("");
    setContent("");
    setImageFile(null);
  };

  // Formulário de criação/edição com área de upload
  const formView = (
    <div className={styles.blogFormContainer}>
      <h2 className={styles.formTitle}>
        {view === "create" ? "Criar Novo Post" : "Editar Post"}
      </h2>
      <form
        onSubmit={view === "create" ? handleCreatePost : handleUpdatePost}
        className={styles.blogForm}
      >
        <div className={styles.inputGroup}>
          <label className={styles.label}>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputLarge}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Subtítulo</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={styles.inputLarge}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Conteúdo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${styles.inputLarge} ${styles.textareaLarge}`}
            required
          />
        </div>
        <div className={styles.fileUploadSection}>
          <div
            className={styles.fileUploadContainer}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div>
            {(editingPost?.image || imageFile) && (
              <Image
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : editingPost?.image || ""
                }
                alt="Imagem do post"
                width={600} // largura ideal
                height={600} // altura ideal
                className={styles.currentLogo}
              />
            )}
            </div>
            <div>
              <div className={styles.dragArea}>
                Arraste o arquivo para cá
              </div>
              <div className={styles.orText}>ou</div>
              <button
                type="button"
                className={styles.selectFileButton}
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar um arquivo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </div>
          </div>
          <p className={styles.fileUploadHint}>
            A imagem deve estar em JPG ou PNG, até 5 MB. Dimensões ideais:
            600x600 pixels.
          </p>
        </div>
        <div className={styles.formButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              resetForm();
              setView("list");
            }}
          >
            Cancelar
          </button>
          {view === "edit" && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDeletePost}
            >
              Deletar
            </button>
          )}
          <button type="submit" className={styles.saveButton}>
            {view === "create" ? "Criar Post" : "Atualizar Post"}
          </button>
        </div>
      </form>
    </div>
  );

  // Listagem dos posts com exibição de imagem, se houver
  const listView = (
    <div className={styles.managementContainer}>
      <h2 className={styles.title}>Blog</h2>
      {loading && <p>Carregando posts...</p>}
      {!loading && posts.length === 0 && <p>Nenhum post encontrado.</p>}
      <div className={styles.blogList}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.blogCard}
            onClick={() => startEditing(post)}
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className={styles.blogImage}
              />
            )}
            <h3 className={styles.blogTitle}>{post.title}</h3>
            {post.subtitle && (
              <p className={styles.blogSubtitle}>{post.subtitle}</p>
            )}
            <p className={styles.blogContentPreview}>
              {post.content.length > 100
                ? post.content.slice(0, 100) + "..."
                : post.content}
            </p>
          </div>
        ))}
        <div className={styles.createCard} onClick={() => setView("create")}>
          <p>+ Criar novo post</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.blogContainer}>
      {view === "list" ? listView : formView}
    </div>
  );
}
