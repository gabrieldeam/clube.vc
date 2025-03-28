import api from "./api";
import {
  ClubStyleCreate,
  ClubStyleResponse,
  ClubStyleUpdate
} from "@/types/clubStyle";

// Cria um estilo de clube (com upload de banners e promo_image)
export const createClubStyle = async (
  data: ClubStyleCreate,
  banner1?: File,
  banner2?: File,
  banner3?: File,
  promoImage?: File
): Promise<ClubStyleResponse> => {
  const formData = new FormData();
  formData.append("club_id", data.club_id);
  formData.append("title", data.title);
  if (data.short_description) formData.append("short_description", data.short_description);
  if (data.full_description) formData.append("full_description", data.full_description);
  if (data.primary_color) formData.append("primary_color", data.primary_color);
  if (data.secondary_color) formData.append("secondary_color", data.secondary_color);
  if (data.primary_text_color) formData.append("primary_text_color", data.primary_text_color);
  if (data.secondary_text_color) formData.append("secondary_text_color", data.secondary_text_color);
  if (data.video_link) formData.append("video_link", data.video_link);
  if (data.promo_title) formData.append("promo_title", data.promo_title);
  if (data.promo_subtitle) formData.append("promo_subtitle", data.promo_subtitle);
  
  if (data.infos) {
    formData.append("infos", JSON.stringify(data.infos));
  }

  if (banner1) formData.append("banner1", banner1);
  if (banner2) formData.append("banner2", banner2);
  if (banner3) formData.append("banner3", banner3);
  if (promoImage) formData.append("promo_image", promoImage);

  const response = await api.post("/club-styles/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Retorna o estilo de um clube
export const getClubStyle = async (clubId: string): Promise<ClubStyleResponse> => {
  const response = await api.get(`/club-styles/${clubId}`);
  return response.data;
};

// Atualiza um estilo de clube (com upload de banners e promo_image)
export const updateClubStyle = async (
  styleId: string,
  data: ClubStyleUpdate,
  banner1?: File,
  banner2?: File,
  banner3?: File,
  promoImage?: File
): Promise<ClubStyleResponse> => {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.short_description) formData.append("short_description", data.short_description);
  if (data.full_description) formData.append("full_description", data.full_description);
  if (data.primary_color) formData.append("primary_color", data.primary_color);
  if (data.secondary_color) formData.append("secondary_color", data.secondary_color);
  if (data.primary_text_color) formData.append("primary_text_color", data.primary_text_color);
  if (data.secondary_text_color) formData.append("secondary_text_color", data.secondary_text_color);
  if (data.video_link) formData.append("video_link", data.video_link);
  if (data.promo_title) formData.append("promo_title", data.promo_title);
  if (data.promo_subtitle) formData.append("promo_subtitle", data.promo_subtitle);

  if (data.infos) {
    formData.append("infos", JSON.stringify(data.infos));
  }

  if (banner1) formData.append("banner1", banner1);
  if (banner2) formData.append("banner2", banner2);
  if (banner3) formData.append("banner3", banner3);
  if (promoImage) formData.append("promo_image", promoImage);

  const response = await api.put(`/club-styles/upload/${styleId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Deleta um estilo de clube
export const deleteClubStyle = async (styleId: string): Promise<void> => {
  await api.delete(`/club-styles/${styleId}`);
};
