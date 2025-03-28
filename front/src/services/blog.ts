import api from "./api";
import {
  BlogPostCreate,
  BlogPostResponse
} from "@/types/blog";

// Cria um post de blog (com upload de imagem)
export const createBlogPost = async (
  data: BlogPostCreate,
  imageFile?: File
): Promise<BlogPostResponse> => {
  const formData = new FormData();
  formData.append("club_id", data.club_id);
  formData.append("title", data.title);
  if (data.subtitle) {
    formData.append("subtitle", data.subtitle);
  }
  formData.append("content", data.content);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await api.post("/blog/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Lista posts de blog de um clube
export const listBlogPosts = async (
  clubId: string
): Promise<BlogPostResponse[]> => {
  const response = await api.get("/blog", {
    params: { club_id: clubId },
  });
  return response.data;
};

// Atualiza um post de blog (com upload de imagem)
export const updateBlogPost = async (
  postId: string,
  title: string,
  content: string,
  subtitle?: string,
  imageFile?: File
): Promise<BlogPostResponse> => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (subtitle) {
    formData.append("subtitle", subtitle);
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await api.put(`/blog/upload/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Deleta um post de blog
export const deleteBlogPost = async (postId: string): Promise<void> => {
  await api.delete(`/blog/${postId}`);
};
