import api from "./api";
import {
  SubscriptionPlanCreate,
  SubscriptionPlanResponse
} from "@/types/subscriptionPlan";

// Cria um novo plano de assinatura
export const createSubscriptionPlan = async (
  plan: SubscriptionPlanCreate
): Promise<SubscriptionPlanResponse> => {
  const response = await api.post("/subscription_plans", plan);
  return response.data;
};

// Lista planos de assinatura de um clube
export const listSubscriptionPlans = async (
  clubId: string
): Promise<SubscriptionPlanResponse[]> => {
  const response = await api.get("/subscription_plans", {
    params: { club_id: clubId }
  });
  return response.data;
};

// Obtém os detalhes de um plano específico pelo ID do plano
export const getSubscriptionPlan = async (
  planId: string
): Promise<SubscriptionPlanResponse> => {
  const response = await api.get(`/subscription_plans/${planId}`);
  return response.data;
};

// Atualiza um plano específico pelo ID do plano
export const updateSubscriptionPlan = async (
  planId: string,
  plan: SubscriptionPlanCreate
): Promise<SubscriptionPlanResponse> => {
  const response = await api.put(`/subscription_plans/${planId}`, plan);
  return response.data;
};

// Deleta um plano específico pelo ID do plano
export const deleteSubscriptionPlan = async (
  planId: string
): Promise<SubscriptionPlanResponse> => {
  const response = await api.delete(`/subscription_plans/${planId}`);
  return response.data;
};
