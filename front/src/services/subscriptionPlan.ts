import api from "./api";
import {
  SubscriptionPlanCreate,
  SubscriptionPlanResponse
} from "@/types/subscriptionPlan";

// Cria um novo plano de assinatura
export const createSubscriptionPlan = async (
  plan: SubscriptionPlanCreate
): Promise<SubscriptionPlanResponse> => {
  const response = await api.post("/subscription-plans", plan);
  return response.data;
};

// Lista planos de assinatura de um clube
export const listSubscriptionPlans = async (
  clubId: string
): Promise<SubscriptionPlanResponse[]> => {
  const response = await api.get("/subscription-plans", {
    params: { club_id: clubId }
  });
  return response.data;
};
