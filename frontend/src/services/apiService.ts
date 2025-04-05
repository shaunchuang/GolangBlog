/**
 * API 請求核心服務
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './apiConfig';

// 從本地存儲獲取 JWT token
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// 建立 axios 實例
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// 請求攔截器 - 在每個請求發送前處理
apiClient.interceptors.request.use(
  (config) => {
    // 如果有 token，則添加到請求頭
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器 - 在每個響應返回後處理
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 處理常見的錯誤情況
    if (error.response) {
      // 服務器返回錯誤狀態碼
      switch (error.response.status) {
        case 401: // 未授權
          // 可能需要清除令牌並重定向到登錄頁面
          localStorage.removeItem('auth_token');
          // 如果有路由系統，可以在這裡導航到登錄頁面
          console.error('未授權訪問，請重新登錄');
          break;
        case 403: // 禁止訪問
          console.error('您沒有權限訪問此資源');
          break;
        case 404: // 未找到
          console.error('請求的資源不存在');
          break;
        case 500: // 服務器錯誤
          console.error('服務器錯誤，請稍後再試');
          break;
        default:
          console.error('發生錯誤:', error.response.data?.error || '未知錯誤');
      }
    } else if (error.request) {
      // 請求發送但沒有收到響應
      console.error('無法連接到服務器，請檢查您的網絡連接');
    } else {
      // 設置請求時發生錯誤
      console.error('請求錯誤:', error.message);
    }
    return Promise.reject(error);
  }
);

// 通用 GET 請求
const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.get(url, { ...config, params })
    .then((response: AxiosResponse) => response.data);
};

// 通用 POST 請求
const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.post(url, data, config)
    .then((response: AxiosResponse) => response.data);
};

// 通用 PUT 請求
const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.put(url, data, config)
    .then((response: AxiosResponse) => response.data);
};

// 通用 DELETE 請求
const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.delete(url, config)
    .then((response: AxiosResponse) => response.data);
};

// 文件上傳請求
const upload = <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.post(url, formData, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data'
    }
  }).then((response: AxiosResponse) => response.data);
};

export const apiService = {
  get,
  post,
  put,
  delete: del,
  upload,
  client: apiClient
};