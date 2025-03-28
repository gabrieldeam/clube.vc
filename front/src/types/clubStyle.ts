export interface ClubStyleInfo {
    info_title?: string;
    info_content?: string;
  }
  
  export interface ClubStyleCreate {
    club_id: string;
    title: string;
    short_description?: string;
    full_description?: string;
    primary_color?: string;
    secondary_color?: string;
    primary_text_color?: string;
    secondary_text_color?: string;
    video_link?: string;
    promo_title?: string;
    promo_subtitle?: string;
    infos?: ClubStyleInfo[];
    // banners e promo_image serão enviados em FormData (arquivos)
  }
  
  export interface ClubStyleResponse {
    id: string;
    club_id: string;
    title: string;
    short_description?: string;
    full_description?: string;
    banner1?: string;
    banner2?: string;
    banner3?: string;
    primary_color?: string;
    secondary_color?: string;
    primary_text_color?: string;
    secondary_text_color?: string;
    video_link?: string;
    promo_title?: string;
    promo_subtitle?: string;
    promo_image?: string;
    infos?: ClubStyleInfo[];
  }
  
  export interface ClubStyleUpdate {
    title: string;
    short_description?: string;
    full_description?: string;
    primary_color?: string;
    secondary_color?: string;
    primary_text_color?: string;
    secondary_text_color?: string;
    video_link?: string;
    promo_title?: string;
    promo_subtitle?: string;
    infos?: ClubStyleInfo[];
    // banners e promo_image serão enviados em FormData (arquivos)
  }
  