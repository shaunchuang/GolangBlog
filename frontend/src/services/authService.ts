/**
 * 認證相關 API 服務
 */
import { apiService } from './apiService';
import { API_PATHS } from './apiConfig';
import { LoginRequest, LoginResponse, RegisterRequest, User, ApiResponse } from '../types/api';

// 用戶登入
const login = (data: LoginRequest): Promise<LoginResponse> => {
  return apiService.post<LoginResponse>(API_PATHS.auth.login, data)
    .then(response => {
      // 將認證令牌保存到本地存儲
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    });
};

// 用戶註冊
const register = (data: RegisterRequest): Promise<ApiResponse<User>> => {
  return apiService.post<ApiResponse<User>>(API_PATHS.auth.register, data);
};

// 獲取當前用戶信息
const getCurrentUser = (): Promise<ApiResponse<User>> => {
  return apiService.get<ApiResponse<User>>(API_PATHS.auth.currentUser);
};

// 登出
const logout = (): void => {
  // 從本地存儲中移除令牌
  localStorage.removeItem('auth_token');
};

// 檢查用戶是否已認證
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

export const authService = {
  login,
  register,
  getCurrentUser,
  logout,
  isAuthenticated
};