export interface CategoryCreate {
    name: string;
  }
  
  export interface CategoryResponse {
    id: number;
    name: string;
  }
  
  export interface CategoryUpdate {
    name?: string;
  }
  