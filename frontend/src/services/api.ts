import { Service, Product, ProductCategory, PortfolioProject, BlogPost, Testimonial, Faq, Page, Lead, User, MediaAsset } from '../types';

const API_BASE = '/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('atloops_admin_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || (errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'An unexpected error occurred');
    throw new Error(message);
  }
  return res.json();
};

export const api = {
  // --- Public APIs ---
  getSettings: async (): Promise<Record<string, string>> => {
    const res = await fetch(`${API_BASE}/settings`);
    const json = await handleResponse(res);
    return json.data;
  },

  getServices: async (params?: { featured?: boolean; category?: string }): Promise<Service[]> => {
    const query = new URLSearchParams();
    if (params?.featured) query.append('featured', '1');
    if (params?.category) query.append('category', params.category);
    const res = await fetch(`${API_BASE}/services?${query.toString()}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getServiceBySlug: async (slug: string): Promise<Service> => {
    const res = await fetch(`${API_BASE}/services/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getProducts: async (params?: { featured?: boolean; category?: string; search?: string }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params?.featured) query.append('featured', '1');
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getProductCategories: async (): Promise<ProductCategory[]> => {
    const res = await fetch(`${API_BASE}/product-categories`);
    const json = await handleResponse(res);
    return json.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getPortfolio: async (params?: { featured?: boolean; industry?: string }): Promise<PortfolioProject[]> => {
    const query = new URLSearchParams();
    if (params?.featured) query.append('featured', '1');
    if (params?.industry) query.append('industry', params.industry);
    const res = await fetch(`${API_BASE}/portfolio?${query.toString()}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getPortfolioBySlug: async (slug: string): Promise<PortfolioProject> => {
    const res = await fetch(`${API_BASE}/portfolio/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const res = await fetch(`${API_BASE}/blog`);
    const json = await handleResponse(res);
    return json.data.data || json.data;
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost> => {
    const res = await fetch(`${API_BASE}/blog/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    const res = await fetch(`${API_BASE}/testimonials`);
    const json = await handleResponse(res);
    return json.data;
  },

  getFaqs: async (category?: string): Promise<Faq[]> => {
    const query = category ? `?category=${category}` : '';
    const res = await fetch(`${API_BASE}/faqs${query}`);
    const json = await handleResponse(res);
    return json.data;
  },

  getPageBySlug: async (slug: string): Promise<Page> => {
    const res = await fetch(`${API_BASE}/pages/${slug}`);
    const json = await handleResponse(res);
    return json.data;
  },

  submitLead: async (data: Record<string, any>): Promise<{ message: string; lead_id?: number }> => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // --- Admin Authentication ---
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    localStorage.removeItem('atloops_admin_token');
    localStorage.removeItem('atloops_admin_user');
  },

  getMe: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res);
    return json.user;
  },

  // --- Admin Dashboard & CMS ---
  getDashboardMetrics: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard/metrics`, {
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res);
    return json.data;
  },

  // Services CRUD
  adminGetServices: async (): Promise<Service[]> => {
    const res = await fetch(`${API_BASE}/admin/services`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminSaveService: async (service: Partial<Service>, id?: number): Promise<Service> => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/admin/services/${id}` : `${API_BASE}/admin/services`;
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(service),
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminDeleteService: async (id: number) => {
    const res = await fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Products CRUD
  adminGetProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE}/admin/products`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminSaveProduct: async (product: Partial<Product>, id?: number): Promise<Product> => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/admin/products/${id}` : `${API_BASE}/admin/products`;
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminDeleteProduct: async (id: number) => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Portfolio CRUD
  adminGetPortfolio: async (): Promise<PortfolioProject[]> => {
    const res = await fetch(`${API_BASE}/admin/portfolio`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminSavePortfolio: async (project: Partial<PortfolioProject>, id?: number): Promise<PortfolioProject> => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/admin/portfolio/${id}` : `${API_BASE}/admin/portfolio`;
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminDeletePortfolio: async (id: number) => {
    const res = await fetch(`${API_BASE}/admin/portfolio/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Visual Page Builder
  adminGetPages: async (): Promise<Page[]> => {
    const res = await fetch(`${API_BASE}/admin/pages`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminGetPage: async (id: number): Promise<Page> => {
    const res = await fetch(`${API_BASE}/admin/pages/${id}`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminSavePageSections: async (id: number, sections: any[], note?: string) => {
    const res = await fetch(`${API_BASE}/admin/pages/${id}/sections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sections, revision_note: note }),
    });
    return handleResponse(res);
  },
  adminRestoreRevision: async (pageId: number, revisionId: number) => {
    const res = await fetch(`${API_BASE}/admin/pages/${pageId}/revisions/${revisionId}/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Leads CRM
  adminGetLeads: async (params?: { status?: string; search?: string }): Promise<{ data: Lead[]; total: number }> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/admin/leads?${query.toString()}`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminGetLead: async (id: number): Promise<Lead> => {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminUpdateLeadStatus: async (id: number, status: string): Promise<Lead> => {
    const res = await fetch(`${API_BASE}/admin/leads/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminAddLeadNote: async (id: number, note: string) => {
    const res = await fetch(`${API_BASE}/admin/leads/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    });
    return handleResponse(res);
  },
  adminArchiveLead: async (id: number): Promise<Lead> => {
    const res = await fetch(`${API_BASE}/admin/leads/${id}/archive`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminExportLeadsUrl: (): string => {
    const token = localStorage.getItem('atloops_admin_token') || '';
    return `${API_BASE}/admin/leads/export?token=${token}`;
  },

  // Media
  adminGetMedia: async (search?: string): Promise<{ data: MediaAsset[] }> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/admin/media${query}`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminUploadMedia: async (file: File, altEn?: string, altAr?: string): Promise<MediaAsset> => {
    const formData = new FormData();
    formData.append('file', file);
    if (altEn) formData.append('alt_text_en', altEn);
    if (altAr) formData.append('alt_text_ar', altAr);

    const token = localStorage.getItem('atloops_admin_token');
    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminDeleteMedia: async (id: number) => {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Global Settings
  adminUpdateSettings: async (settings: Record<string, string>) => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings }),
    });
    return handleResponse(res);
  },

  // Users & RBAC
  adminGetUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() });
    const json = await handleResponse(res);
    return json.data;
  },
  adminSaveUser: async (user: Partial<User>, id?: number): Promise<User> => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/admin/users/${id}` : `${API_BASE}/admin/users`;
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    const json = await handleResponse(res);
    return json.data;
  },
  adminDeleteUser: async (id: number) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

