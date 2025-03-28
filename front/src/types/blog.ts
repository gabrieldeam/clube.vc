export interface BlogPostCreate {
    club_id: string;
    title: string;
    subtitle?: string;
    content: string;
    // image será enviado em um FormData (arquivo)
  }
  
  export interface BlogPostResponse {
    id: string;
    club_id: string;
    title: string;
    subtitle?: string;
    content: string;
    image?: string;
  }
  