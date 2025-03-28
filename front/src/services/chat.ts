import api from "./api";
import {
  DirectMessageCreate,
  DirectMessageResponse,
  GroupMessageCreate,
  GroupMessageResponse
} from "@/types/chat";

// Envia mensagem direta
export const sendDirectMessage = async (
  data: DirectMessageCreate,
  imageFile?: File
): Promise<DirectMessageResponse> => {
  const formData = new FormData();
  // Necessário path param, então iremos usar /chat/direct/{clubId}
  // e no body colocamos o restante do FormData
  formData.append("content", data.content || "");
  if (imageFile) {
    formData.append("image", imageFile);
  }
  // Requisição via POST, utilizando URL dinâmica com o club_id
  const response = await api.post(`/chat/direct/${data.club_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Obtém as mensagens diretas entre usuário e dono do clube
export const getDirectMessages = async (
  clubId: string
): Promise<DirectMessageResponse[]> => {
  const response = await api.get(`/chat/direct/${clubId}`);
  return response.data;
};

// Envia mensagem em grupo
export const sendGroupMessage = async (
  data: GroupMessageCreate,
  imageFile?: File
): Promise<GroupMessageResponse> => {
  const formData = new FormData();
  formData.append("content", data.content || "");
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await api.post(`/chat/group/${data.club_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Obtém mensagens em grupo de um clube
export const getGroupMessages = async (
  clubId: string
): Promise<GroupMessageResponse[]> => {
  const response = await api.get(`/chat/group/${clubId}`);
  return response.data;
};
