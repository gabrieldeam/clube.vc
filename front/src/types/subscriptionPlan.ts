export interface SubscriptionPlanBenefit {
    benefit: string;
  }
  
  export interface SubscriptionPlanCreate {
    club_id: string;
    name: string;
    description: string;
    price: number;
    benefits?: SubscriptionPlanBenefit[];
  }
  
  export interface SubscriptionPlanResponse {
    id: string;
    club_id: string;
    name: string;
    description: string;
    price: number;
    benefits?: SubscriptionPlanBenefit[];
  }
  