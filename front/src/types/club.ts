export interface ClubCreate {
    name: string;
    category_id: number;
  }
  
  export interface ClubResponse {
    id: string;
    name: string;
    logo?: string;
    category_id: number;
    owner_id: string;
    banner?: string;
  }
  
  export interface ClubUpdate {
    name?: string;
    category_id?: number;
  }
  