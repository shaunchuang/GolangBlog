import apiClient from './apiConfig';
import { Tag, DetailResponse, PaginatedResponse } from '@/types/api';

// 標籤相關的 API 服務
export const tagService = {
  // 獲取所有標籤
  getTags: async (params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
  }) => {
    const response = await apiClient.get<PaginatedResponse<Tag>>('/tags', { params });
    return response.data;
  },
  
  // 根據 ID 獲取單個標籤
  getTagById: async (id: number | string) => {
    const response = await apiClient.get<DetailResponse<Tag>>(`/tags/${id}`);
    return response.data;
  },
  
  // 根據 slug 獲取單個標籤
  getTagBySlug: async (slug: string) => {
    const response = await apiClient.get<DetailResponse<Tag>>(`/tags/slug/${slug}`);
    return response.data;
  },
  
  // 創建新標籤
  createTag: async (tagData: Partial<Tag>) => {
    const response = await apiClient.post<DetailResponse<Tag>>('/tags', tagData);
    return response.data;
  },
  
  // 更新標籤
  updateTag: async (id: number | string, tagData: Partial<Tag>) => {
    const response = await apiClient.put<DetailResponse<Tag>>(`/tags/${id}`, tagData);
    return response.data;
  },
  
  // 刪除標籤
  deleteTag: async (id: number | string) => {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data;
  }
};
