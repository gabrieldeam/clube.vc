import api from "./api";
import {
  ClubSubscriptionCreate,
  ClubSubscriptionResponse
} from "@/types/clubSubscription";

// Cria uma inscrição no clube
export const subscribeToClub = async (
  data: ClubSubscriptionCreate
): Promise<ClubSubscriptionResponse> => {
  const response = await api.post("/club-subscriptions", data);
  return response.data;
};

// Remove uma inscrição do clube
export const unsubscribeFromClub = async (
  subscriptionId: string
): Promise<void> => {
  await api.delete(`/club-subscriptions/${subscriptionId}`);
};

export const listUserSubscriptions = async (): Promise<ClubSubscriptionResponse[]> => {
    const response = await api.get("/club-subscriptions");
    return response.data;
  };