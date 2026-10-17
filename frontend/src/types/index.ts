export type Locale = 'en' | 'ar';

export interface Service {
  id: number;
  slug: string;
  icon: string;
  category: string;
  title_en: string;
  title_ar: string;
  short_desc_en: string;
  short_desc_ar: string;
  description_en: string;
  description_ar: string;
  benefits_en?: string[];
  benefits_ar?: string[];
  capabilities_en?: string[];
  capabilities_ar?: string[];
  process_steps_en?: string[];
  process_steps_ar?: string[];
  faqs?: Array<{ question_en: string; question_ar: string; answer_en: string; answer_ar: string }>;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface ProductCategory {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  products_count?: number;
}

export interface Product {
  id: number;
  category_id?: number;
  category?: ProductCategory;
  slug: string;
  name_en: string;
  name_ar: string;
  tagline_en?: string;
  tagline_ar?: string;
  short_desc_en: string;
  short_desc_ar: string;
  description_en: string;
  description_ar: string;
  features_en?: string[];
  features_ar?: string[];
  badge?: string;
  price?: number;
  original_price?: number;
  pricing_model: string;
  demo_url?: string;
  thumbnail?: string;
  gallery?: string[];
  supported_platforms?: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  client_name_en?: string;
  client_name_ar?: string;
  industry_en: string;
  industry_ar: string;
  short_desc_en: string;
  short_desc_ar: string;
  description_en: string;
  description_ar: string;
  challenge_en?: string;
  challenge_ar?: string;
  solution_en?: string;
  solution_ar?: string;
  results_en?: string[];
  results_ar?: string[];
  tech_stack?: string[];
  thumbnail?: string;
  gallery?: string[];
  live_url?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: number;
  category_id?: number;
  category?: { id: number; name_en: string; name_ar: string; slug: string };
  author?: { id: number; name: string };
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  thumbnail?: string;
  reading_time: number;
  published_at?: string;
  view_count: number;
}

export interface Testimonial {
  id: number;
  client_name_en: string;
  client_name_ar: string;
  client_role_en: string;
  client_role_ar: string;
  company_en: string;
  company_ar: string;
  content_en: string;
  content_ar: string;
  rating: number;
  avatar?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface Faq {
  id: number;
  category: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  sort_order: number;
  is_active: boolean;
}

export interface PageSection {
  id?: number;
  block_type: string;
  sort_order: number;
  content_en: Record<string, any>;
  content_ar: Record<string, any>;
  settings?: Record<string, any>;
  is_active?: boolean;
}

export interface Page {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  is_published: boolean;
  published_at?: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  sections?: PageSection[];
  revisions?: Array<{ id: number; revision_title: string; created_at: string; user?: { name: string } }>;
}

export interface Lead {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone: string;
  country?: string;
  service_of_interest?: string;
  estimated_budget?: string;
  message: string;
  source_page?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  assigned_to?: number;
  assigned_user?: { id: number; name: string };
  created_at: string;
  notes?: Array<{ id: number; note: string; created_at: string; user?: { name: string } }>;
  activities?: Array<{ id: number; action: string; description: string; created_at: string; user?: { name: string } }>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'content_manager' | 'marketing_manager' | 'sales_rep' | 'support_agent' | 'analyst';
  phone?: string;
  avatar?: string;
  is_active?: boolean;
  is_superadmin?: boolean;
  is_admin?: boolean;
}

export interface MediaAsset {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  path: string;
  alt_text_en?: string;
  alt_text_ar?: string;
  created_at: string;
}
