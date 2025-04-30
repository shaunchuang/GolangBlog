import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from './apiConfig';

// 創建 axios 實例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 請求超時時間(毫秒)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 請求攔截器 - 在每個請求發送前處理
apiClient.interceptors.request.use(
  (config) => {
    // 如果瀏覽器端可用，獲取 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 響應攔截器 - 在每個響應返回後處理
apiClient.interceptors.response.use(
  (response) => {
    // 添加詳細的成功響應日誌，幫助調試
    console.log(`API 響應 [${response.config.method?.toUpperCase()}] ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // 添加詳細的錯誤日誌
    console.error(`API 錯誤:`, {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // 處理常見的錯誤情況
    if (error.response) {
      // 服務器返回錯誤狀態碼
      switch (error.response.status) {
        case 401: // 未授權
          // 可能需要清除令牌並重定向到登錄頁面
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            // 如果在客戶端執行，可以進行導航
            console.error('未授權訪問，請重新登錄');
          }
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