import { formatError } from '../utils/errorHandling';

// 文章類型定義
export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  authorId: number;
  authorName: string;
  tags: Tag[];
  language: string;
}

// 標籤類型定義
export interface Tag {
  id: number;
  name: string;
}

// 分類類型定義
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// 搜索回應類型定義
export interface SearchResponse {
  articles: Article[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
}

// 後端API的基本URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API服務類
class ApiService {
  // 獲取精選文章
  async getFeaturedArticles(locale: string, limit: number = 5): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/featured?language=${locale}&limit=${limit}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw formatError(error);
    }
  }
  
  // 獲取最新文章
  async getLatestArticles(locale: string, page: number = 1, limit: number = 10): Promise<{ articles: Article[], totalPages: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles?language=${locale}&page=${page}&limit=${limit}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest articles:', error);
      throw formatError(error);
    }
  }
  
  // 按分類獲取文章
  async getCategoryArticles(categorySlug: string, locale: string, page: number = 1, limit: number = 10): Promise<{ articles: Article[], category: Category, totalPages: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/articles?language=${locale}&page=${page}&limit=${limit}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching articles for category ${categorySlug}:`, error);
      throw formatError(error);
    }
  }
  
  // 搜索文章
  async searchArticles(query: string, page: number = 1, limit: number = 10, locale: string): Promise<SearchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&language=${locale}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching articles:', error);
      throw formatError(error);
    }
  }
  
  // 獲取單篇文章
  async getArticle(slug: string, locale: string): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${slug}?language=${locale}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching article ${slug}:`, error);
      throw formatError(error);
    }
  }
  
  // 獲取所有分類
  async getCategories(locale: string): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories?language=${locale}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw formatError(error);
    }
  }
  
  // 獲取熱門標籤
  async getPopularTags(locale: string, limit: number = 10): Promise<Tag[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/popular?language=${locale}&limit=${limit}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      throw formatError(error);
    }
  }
  
  // 按標籤獲取文章
  async getTagArticles(tagName: string, locale: string, page: number = 1, limit: number = 10): Promise<{ articles: Article[], tag: Tag, totalPages: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/${encodeURIComponent(tagName)}/articles?language=${locale}&page=${page}&limit=${limit}`, {
        headers: {
          'Accept-Language': locale
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching articles for tag ${tagName}:`, error);
      throw formatError(error);
    }
  }
}

// 匯出單例實例
const apiService = new ApiService();
export default apiService;