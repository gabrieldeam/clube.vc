// services/category.ts
import api from "./api";
import { CategoryCreate, CategoryResponse, CategoryUpdate } from "@/types/category";

// Cria uma categoria (exige permissões de admin no backend)
export const createCategory = async (category: CategoryCreate): Promise<CategoryResponse> => {
  const response = await api.post("/categories/", category);
  return response.data;
};

// Lista todas as categorias
export const listCategories = async (): Promise<CategoryResponse[]> => {
  const response = await api.get("/categories/");
  return response.data;
};

// Obtém uma categoria pelo ID
export const getCategory = async (categoryId: number): Promise<CategoryResponse> => {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
};

// Atualiza os dados de uma categoria (exige permissões de admin)
export const updateCategory = async (
  categoryId: number,
  categoryData: CategoryUpdate
): Promise<CategoryResponse> => {
  const response = await api.put(`/categories/${categoryId}`, categoryData);
  return response.data;
};

// Exclui uma categoria (exige permissões de admin)
export const deleteCategory = async (categoryId: number): Promise<void> => {
  await api.delete(`/categories/${categoryId}`);
};
