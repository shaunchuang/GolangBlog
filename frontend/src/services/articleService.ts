/**
 * 文章相關 API 服務
 */
import { apiService } from './apiService';
import { API_PATHS } from './apiConfig';
import { Article, ApiResponse, PaginatedResponse } from '../types/api';

// 查詢參數接口
interface ArticleQueryParams {
  page?: number;
  page_size?: number;
  status?: string;
  tag_id?: number | string;
  category_id?: number | string;
  lang?: string;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
  search?: string;
}

// 獲取文章列表
const getArticles = (params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> => {
  return apiService.get<PaginatedResponse<Article>>(API_PATHS.articles.list, params);
};

// 獲取單個文章（通過ID）
const getArticleById = (id: number | string): Promise<ApiResponse<Article>> => {
  return apiService.get<ApiResponse<Article>>(API_PATHS.articles.detail(id));
};

// 獲取單個文章（通過slug）
const getArticleBySlug = (slug: string): Promise<ApiResponse<Article>> => {
  return apiService.get<ApiResponse<Article>>(API_PATHS.articles.bySlug(slug));
};

// 創建文章（管理員/編輯者功能）
const createArticle = (data: any): Promise<ApiResponse<Article>> => {
  return apiService.post<ApiResponse<Article>>(API_PATHS.admin.articles.create, data);
};

// 更新文章（管理員/編輯者功能）
const updateArticle = (id: number | string, data: any): Promise<ApiResponse<Article>> => {
  return apiService.put<ApiResponse<Article>>(API_PATHS.admin.articles.update(id), data);
};

// 刪除文章（管理員/編輯者功能）
const deleteArticle = (id: number | string): Promise<ApiResponse<any>> => {
  return apiService.delete<ApiResponse<any>>(API_PATHS.admin.articles.delete(id));
};

export const articleService = {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle
};