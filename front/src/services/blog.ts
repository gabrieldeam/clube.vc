import api from "./api";
import { BlogPostResponse } from "@/types/blog";

// Cria um post de blog (com upload de imagem)
export const createBlogPost = async (data: FormData): Promise<BlogPostResponse> => {
  const response = await api.post("/blog/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Lista os posts de blog de um clube
export const listBlogPosts = async (clubId: string): Promise<BlogPostResponse[]> => {
  const response = await api.get(`/blog/clubs/${clubId}/blog`);
  return response.data;
};


// Atualiza um post de blog (com upload de imagem)
export const updateBlogPost = async (
  postId: string,
  data: FormData
): Promise<BlogPostResponse> => {
  const response = await api.put(`/blog/upload/${postId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Deleta um post de blog
export const deleteBlogPost = async (postId: string): Promise<void> => {
  await api.delete(`/blog/${postId}`);
};
