import apiClient from './apiConfig';
import { LoginResponse, RegisterResponse, DetailResponse, User } from '@/types/api';

// 認證相關的 API 服務
export const authService = {
  // 用戶登入
  login: async (email: string, password: string) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password
    });
    
    // 將 token 保存到本地存儲
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  },
  
  // 用戶註冊
  register: async (username: string, email: string, password: string) => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', {
      username,
      email,
      password
    });
    
    // 將 token 保存到本地存儲
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  },
  
  // 用戶登出
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_remember');
  },
  
  // 獲取當前用戶信息
  getCurrentUser: async () => {
    const response = await apiClient.get<DetailResponse<User>>('/auth/me');
    return response.data;
  },
  
  // 更新用戶資料
  updateProfile: async (userData: Partial<User>) => {
    const response = await apiClient.put<DetailResponse<User>>('/auth/profile', userData);
    return response.data;
  },
  
  // 更新用戶密碼
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  }
};
