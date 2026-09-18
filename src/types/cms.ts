export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  display_order: number;
}

export interface CMSProject {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  category_slug: string;
  category?: string; // alias for compatibility
  client_en: string;
  client_ar: string;
  year: string;
  location_en: string;
  location_ar: string;
  overview_en: string;
  overview_ar: string;
  challenge_en: string;
  challenge_ar: string;
  solution_en: string;
  solution_ar: string;
  deliverables_en: string[];
  deliverables_ar: string[];
  impact_en: string[];
  impact_ar: string[];
  cover_image: string;
  gallery: string[];
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at: string;
}

export interface CMSTestimonial {
  id: string;
  person_name_en: string;
  person_name_ar: string;
  designation_en: string;
  designation_ar: string;
  company_en: string;
  company_ar: string;
  text_en: string;
  text_ar: string;
  rating?: number;
  photo_url?: string;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at: string;
}

export interface CMSClientLogo {
  id: string;
  name_en: string;
  name_ar: string;
  logo_url: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at: string;
}

export interface CMSSettings {
  testimonial_display_count?: number; // How many testimonials to show on the public website (default: 3, 0 = All)
  updated_at?: string;
}
