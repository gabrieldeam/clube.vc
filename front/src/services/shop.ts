import api from "./api";
import {
  ShopItemCreate,
  ShopItemResponse,
  ShopItemUpdate
} from "@/types/shop";

// Cria um item de loja (com upload de foto opcional)
export const createShopItem = async (
  data: ShopItemCreate,
  photoFile?: File
): Promise<ShopItemResponse> => {
  const formData = new FormData();
  formData.append("club_id", data.club_id);
  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  if (data.external_link) formData.append("external_link", data.external_link);
  if (data.short_description) formData.append("short_description", data.short_description);
  if (photoFile) {
    formData.append("photo", photoFile);
  }
  const response = await api.post("/shop/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Lista os itens de loja de um clube
export const listShopItems = async (clubId: string): Promise<ShopItemResponse[]> => {
  const response = await api.get("/shop", {
    params: { club_id: clubId },
  });
  return response.data;
};

// Atualiza um item de loja (com upload de foto opcional)
export const updateShopItem = async (
  itemId: string,
  data: ShopItemUpdate,
  photoFile?: File
): Promise<ShopItemResponse> => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.external_link) formData.append("external_link", data.external_link);
  if (data.short_description) formData.append("short_description", data.short_description);
  if (photoFile) {
    formData.append("photo", photoFile);
  }
  const response = await api.put(`/shop/upload/${itemId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Deleta um item de loja
export const deleteShopItem = async (itemId: string): Promise<void> => {
  await api.delete(`/shop/${itemId}`);
};
