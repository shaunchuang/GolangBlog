import apiClient from './apiConfig';
import { Article, DetailResponse, PaginatedResponse } from '@/types/api';

// 文章相關的 API 服務
export const articleService = {
  // 獲取文章列表，支持分頁和過濾
  getArticles: async (params?: {
    page?: number;
    pageSize?: number;
    category?: number | string;
    tag?: number | string;
    search?: string;
    status?: string;
  }) => {
    const response = await apiClient.get<PaginatedResponse<Article>>('/articles', { params });
    return response.data;
  },
  
  // 根據 ID 獲取單篇文章
  getArticleById: async (id: number | string) => {
    const response = await apiClient.get<DetailResponse<Article>>(`/articles/${id}`);
    return response.data;
  },
  
  // 根據 slug 獲取單篇文章
  getArticleBySlug: async (slug: string) => {
    const response = await apiClient.get<DetailResponse<Article>>(`/articles/slug/${slug}`);
    return response.data;
  },
  
  // 創建新文章
  createArticle: async (articleData: Partial<Article>) => {
    const response = await apiClient.post<DetailResponse<Article>>('/articles', articleData);
    return response.data;
  },
  
  // 更新現有文章
  updateArticle: async (id: number | string, articleData: Partial<Article>) => {
    const response = await apiClient.put<DetailResponse<Article>>(`/articles/${id}`, articleData);
    return response.data;
  },
  
  // 刪除文章
  deleteArticle: async (id: number | string) => {
    const response = await apiClient.delete(`/articles/${id}`);
    return response.data;
  },
  
  // 上傳文章圖片
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post<{ url: string }>('/uploads/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};
