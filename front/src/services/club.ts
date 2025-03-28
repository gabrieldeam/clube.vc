// services/club.ts
import api from "./api";
import { ClubCreate, ClubResponse, ClubUpdate } from "@/types/club";

// Cria um clube com upload de logo
export const createClub = async (club: ClubCreate, logoFile?: File): Promise<ClubResponse> => {
  const formData = new FormData();
  formData.append("name", club.name);
  formData.append("category_id", club.category_id.toString());
  if (logoFile) {
    formData.append("logo", logoFile);
  }
  const response = await api.post("/clubs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Lista os clubes do usuário logado
export const listClubs = async (): Promise<ClubResponse[]> => {
  const response = await api.get("/clubs");
  return response.data;
};

// Obtém os detalhes de um clube
export const getClub = async (clubId: string): Promise<ClubResponse> => {
  const response = await api.get(`/clubs/${clubId}`);
  return response.data;
};

// Atualiza os dados do clube com upload de logo
export const updateClub = async (
  clubId: string,
  club: ClubUpdate,
  logoFile?: File
): Promise<ClubResponse> => {
  const formData = new FormData();
  if (club.name) formData.append("name", club.name);
  if (club.category_id !== undefined) formData.append("category_id", club.category_id.toString());
  if (logoFile) {
    formData.append("logo", logoFile);
  }
  const response = await api.put(`/clubs/upload/${clubId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Remove um clube (opcional, se necessário)
export const deleteClub = async (clubId: string) => {
  const response = await api.delete(`/clubs/${clubId}`);
  return response.data;
};
