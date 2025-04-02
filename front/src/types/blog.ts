export interface BlogPostCreate {
  club_id: string;
  title: string;
  subtitle?: string;
  content: string;
}

export interface BlogPostResponse {
  id: string;
  club_id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  created_at: string;
}
