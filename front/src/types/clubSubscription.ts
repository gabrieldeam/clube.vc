export interface ClubSubscriptionCreate {
    club_id: string;
    plan_id: string;
  }
  
  export interface ClubSubscriptionResponse {
    id: string;
    club_id: string;
    plan_id: string;
    user_id: string;
  }
  