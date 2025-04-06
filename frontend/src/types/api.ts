/**
 * 定義常見的API請求和響應類型
 */

// 通用分頁響應接口
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// 通用API響應接口
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

// 標籤相關接口
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  article_count?: number;
  created_at: string;
  updated_at: string;
}

export interface TagTranslation {
  id: number;
  tag_id: number;
  language_code: string;
  name: string;
  slug: string;
}

// 分類相關接口
export interface Category {
  id: number;
  parent_id: number | null;
  parent?: Category;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  article_count?: number;
  translations?: CategoryTranslation[];
}

// 分類翻譯相關接口
export interface CategoryTranslation {
  id: number;
  category_id: number;
  language_code: string;
  name: string;
  slug: string;
  description: string;
}

// 文章相關接口
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  category_id?: number;
  category?: Category;
  tags?: Tag[];
  author?: User;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ArticleTranslation {
  id: number;
  article_id: number;
  language_code: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

// 用戶相關接口
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  avatar?: string;
}

// 認證相關接口
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// 語言相關接口
export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  is_default: boolean;
  direction: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// 圖片相關接口
export interface Image {
  id: number;
  user_id: number;
  title: string;
  alt: string;
  filename: string;
  filepath: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  usage: string;
  created_at: string;
  updated_at: string;
}

// API 錯誤響應
export interface ApiError {
  error: string;
  status: number;
}