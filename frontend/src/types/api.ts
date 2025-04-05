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
  message?: string;
  error?: string;
  [key: string]: any;
}

// 標籤相關接口
export interface Tag {
  id: number;
  created_at: string;
  updated_at: string;
  translations: TagTranslation[];
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
  created_at: string;
  updated_at: string;
  translations: CategoryTranslation[];
}

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
  user_id: number;
  status: string;
  featured_image: string;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  translations: ArticleTranslation[];
  tags: Tag[];
  categories: Category[];
  user: User;
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
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  avatar: string;
  created_at: string;
  updated_at: string;
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