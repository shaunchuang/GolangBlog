import apiClient from './apiConfig';
import { Category, DetailResponse, PaginatedResponse } from '@/types/api';

// 分類相關的 API 服務
export const categoryService = {
  // 獲取所有分類
  getCategories: async (params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
  }) => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },
  
  // 根據 ID 獲取單個分類
  getCategoryById: async (id: number | string) => {
    const response = await apiClient.get<DetailResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
  
  // 根據 slug 獲取單個分類
  getCategoryBySlug: async (slug: string) => {
    const response = await apiClient.get<DetailResponse<Category>>(`/categories/slug/${slug}`);
    return response.data;
  },
  
  // 創建新分類
  createCategory: async (categoryData: Partial<Category>) => {
    const response = await apiClient.post<DetailResponse<Category>>('/categories', categoryData);
    return response.data;
  },
  
  // 更新分類
  updateCategory: async (id: number | string, categoryData: Partial<Category>) => {
    const response = await apiClient.put<DetailResponse<Category>>(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  // 刪除分類
  deleteCategory: async (id: number | string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }
};
