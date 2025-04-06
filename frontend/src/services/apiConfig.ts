/**
 * API 服務基礎配置
 */

// 獲取環境變量中的 API 基礎 URL，如果不存在則使用默認值
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// 定義 API 配置
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 請求超時時間(毫秒)
  withCredentials: false, // 修改為 false，因為我們使用 JWT 而不是 cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API 路徑配置
export const API_PATHS = {
  // 認證相關
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    currentUser: '/user'
  },
  
  // 文章相關
  articles: {
    list: '/articles',
    detail: (id: number | string) => `/articles/${id}`,
    bySlug: (slug: string) => `/articles/slug/${slug}`
  },
  
  // 標籤相關
  tags: {
    list: '/tags',
    detail: (id: number | string) => `/tags/${id}`
  },
  
  // 分類相關
  categories: {
    list: '/categories',
    detail: (id: number | string) => `/categories/${id}`
  },
  
  // 語言相關
  languages: {
    list: '/languages',
    detail: (id: number | string) => `/languages/${id}`,
    byCode: (code: string) => `/languages/code/${code}`
  },
  
  // 圖片相關
  images: {
    list: '/images',
    detail: (id: number | string) => `/images/${id}`,
    upload: '/images'
  },
  
  // 工具相關
  utils: {
    generateSlug: '/utils/generate-slug'
  },
  
  // 管理員專用 API
  admin: {
    // 語言管理
    languages: {
      create: '/admin/languages',
      update: (id: number | string) => `/admin/languages/${id}`,
      delete: (id: number | string) => `/admin/languages/${id}`,
      setDefault: (id: number | string) => `/admin/languages/${id}/default`,
      toggle: (id: number | string) => `/admin/languages/${id}/toggle`,
      updateOrder: '/admin/languages/order'
    },
    
    // 文章管理
    articles: {
      create: '/admin/articles',
      update: (id: number | string) => `/admin/articles/${id}`,
      delete: (id: number | string) => `/admin/articles/${id}`
    },
    
    // 標籤管理
    tags: {
      create: '/admin/tags',
      update: (id: number | string) => `/admin/tags/${id}`,
      delete: (id: number | string) => `/admin/tags/${id}`
    },
    
    // 分類管理
    categories: {
      create: '/admin/categories',
      update: (id: number | string) => `/admin/categories/${id}`,
      delete: (id: number | string) => `/admin/categories/${id}`
    }
  }
};