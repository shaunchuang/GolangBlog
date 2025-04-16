/**
 * API 相關的類型定義
 */

// 用戶對象
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  created_at: string;
  updated_at: string;
  avatar?: string;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
    social_links?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
}

// 分類對象
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  article_count?: number;
}

// 標籤對象
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  article_count?: number;
}

// 文章對象
export interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  status: 'draft' | 'published';
  featured_image?: string;
  author_id: number;
  category_id?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
  
  // 關聯對象
  author?: User;
  category?: Category;
  tags?: Tag[];
}

// 登入請求
export interface LoginRequest {
  email: string;
  password: string;
}

// 登入響應
export interface LoginResponse {
  token: string;
  user: User;
}

// 註冊請求
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// 註冊響應
export interface RegisterResponse {
  token: string;
  user: User;
}

// API 分頁響應
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// API 詳情響應
export interface DetailResponse<T> {
  data: T;
}

// API 錯誤響應
export interface ErrorResponse {
  error: string;
  errors?: string[];
  status_code?: number;
}
