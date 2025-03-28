export interface ShopItemCreate {
    club_id: string;           // UUID
    name: string;
    price: number;
    external_link?: string;
    short_description?: string;
    // photo será enviado em um FormData (arquivo)
  }
  
  export interface ShopItemResponse {
    id: string;
    club_id: string;
    name: string;
    price: number;
    external_link?: string;
    short_description?: string;
    photo?: string;
  }
  
  export interface ShopItemUpdate {
    name?: string;
    price?: number;
    external_link?: string;
    short_description?: string;
    // photo será enviado em um FormData (arquivo)
  }
  