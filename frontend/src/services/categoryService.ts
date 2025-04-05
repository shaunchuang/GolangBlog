/**
 * 分類相關 API 服務
 */
import { apiService } from './apiService';
import { API_PATHS } from './apiConfig';
import { Category, ApiResponse, PaginatedResponse } from '../types/api';

// 查詢參數接口
interface CategoryQueryParams {
  page?: number;
  page_size?: number;
  lang?: string;
  parent_id?: number | string;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
  search?: string;
}

// 獲取分類列表
const getCategories = (params?: CategoryQueryParams): Promise<PaginatedResponse<Category>> => {
  return apiService.get<PaginatedResponse<Category>>(API_PATHS.categories.list, params);
};

// 獲取單個分類
const getCategoryById = (id: number | string): Promise<ApiResponse<Category>> => {
  return apiService.get<ApiResponse<Category>>(API_PATHS.categories.detail(id));
};

// 創建分類（管理員/編輯者功能）
const createCategory = (data: any): Promise<ApiResponse<Category>> => {
  return apiService.post<ApiResponse<Category>>(API_PATHS.admin.categories.create, data);
};

// 更新分類（管理員/編輯者功能）
const updateCategory = (id: number | string, data: any): Promise<ApiResponse<Category>> => {
  return apiService.put<ApiResponse<Category>>(API_PATHS.admin.categories.update(id), data);
};

// 刪除分類（管理員/編輯者功能）
const deleteCategory = (id: number | string): Promise<ApiResponse<any>> => {
  return apiService.delete<ApiResponse<any>>(API_PATHS.admin.categories.delete(id));
};

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};