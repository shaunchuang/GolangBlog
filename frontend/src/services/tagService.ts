/**
 * 標籤相關 API 服務
 */
import { apiService } from './apiService';
import { API_PATHS } from './apiConfig';
import { Tag, ApiResponse, PaginatedResponse } from '../types/api';

// 查詢參數接口
interface TagQueryParams {
  page?: number;
  page_size?: number;
  lang?: string;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
  search?: string;
}

// 獲取標籤列表
const getTags = (params?: TagQueryParams): Promise<PaginatedResponse<Tag>> => {
  return apiService.get<PaginatedResponse<Tag>>(API_PATHS.tags.list, params);
};

// 獲取單個標籤
const getTagById = (id: number | string): Promise<ApiResponse<Tag>> => {
  return apiService.get<ApiResponse<Tag>>(API_PATHS.tags.detail(id));
};

// 創建標籤（管理員/編輯者功能）
const createTag = (data: any): Promise<ApiResponse<Tag>> => {
  return apiService.post<ApiResponse<Tag>>(API_PATHS.admin.tags.create, data);
};

// 更新標籤（管理員/編輯者功能）
const updateTag = (id: number | string, data: any): Promise<ApiResponse<Tag>> => {
  return apiService.put<ApiResponse<Tag>>(API_PATHS.admin.tags.update(id), data);
};

// 刪除標籤（管理員/編輯者功能）
const deleteTag = (id: number | string): Promise<ApiResponse<any>> => {
  return apiService.delete<ApiResponse<any>>(API_PATHS.admin.tags.delete(id));
};

export const tagService = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
};