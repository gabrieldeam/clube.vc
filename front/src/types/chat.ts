// Mensagem direta
export interface DirectMessageCreate {
    club_id: string;
    content?: string;
    // image será enviado em um FormData (arquivo)
  }
  
  export interface DirectMessageResponse {
    id: string;
    club_id: string;
    sender_id: string;
    receiver_id: string;
    content?: string;
    image?: string;
    created_at: string; // considerando que venha a data/hora
  }
  
  // Mensagem em grupo
  export interface GroupMessageCreate {
    club_id: string;
    content?: string;
    // image será enviado em um FormData (arquivo)
  }
  
  export interface GroupMessageResponse {
    id: string;
    club_id: string;
    sender_id: string;
    content?: string;
    image?: string;
    created_at: string;
  }
  