// 定義 API 常數
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (IS_PRODUCTION ? 'https://news.sj-sphere.com/api/v1' : 'http://localhost:8080/api/v1');

// 定義其他常用 URL
export const IMAGE_BASE_URL = IS_PRODUCTION 
  ? 'https://news.sj-sphere.com/images/news' 
  : '/images/news';
  
// 定義 API 路徑
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
    featured: '/articles/featured',
    latest: '/articles/latest',
    detail: (id: number | string) => `/articles/${id}`,
    bySlug: (slug: string) => `/articles/slug/${slug}`,
    byCategory: (category: string, limit?: number) => 
      `/articles/category/${category}${limit ? `?limit=${limit}` : ''}`
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
  }
};