/**
 * 處理文章數據的 reducer
 */
import { Action, ActionType } from '../../types/state';

// 文章狀態接口
export interface ArticlesState {
  list: any[];
  current: any | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  filters: {
    category_id?: number | string;
    tag_id?: number | string;
    search?: string;
    [key: string]: any;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 初始文章狀態
export const initialArticlesState: ArticlesState = {
  list: [],
  current: null,
  loading: false,
  error: null,
  lastFetched: null, // 最後獲取時間，用於緩存控制
  filters: {},
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
};

// 緩存有效時間（毫秒）: 5分鐘
const CACHE_VALIDITY = 5 * 60 * 1000;

// 檢查是否需要從服務器獲取文章
export const shouldFetchArticles = (state: ArticlesState): boolean => {
  // 如果從未獲取過數據，或者距離上次獲取已經超過緩存有效時間
  if (state.lastFetched === null || (Date.now() - state.lastFetched) > CACHE_VALIDITY) {
    return true;
  }
  
  // 如果沒有數據，但有錯誤，說明之前的獲取失敗了，需要重試
  if (state.list.length === 0 && state.error) {
    return true;
  }
  
  return false;
};

// 文章 reducer
export const articlesReducer = (state: ArticlesState = initialArticlesState, action: Action): ArticlesState => {
  switch (action.type) {
    case ActionType.FETCH_ARTICLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ActionType.FETCH_ARTICLES_SUCCESS:
      return {
        ...state,
        list: action.payload.data || [],
        loading: false,
        error: null,
        lastFetched: Date.now(),
        pagination: {
          page: action.payload.page || 1,
          pageSize: action.payload.page_size || 10,
          total: action.payload.total || 0,
          totalPages: action.payload.total_pages || 0
        }
      };
    
    case ActionType.FETCH_ARTICLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || '獲取文章列表失敗'
      };
    
    case ActionType.FETCH_ARTICLE_REQUEST:
      return {
        ...state,
        current: null,
        loading: true,
        error: null
      };
      
    case ActionType.FETCH_ARTICLE_SUCCESS:
      return {
        ...state,
        current: action.payload,
        loading: false,
        error: null
      };
      
    case ActionType.FETCH_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || '獲取文章詳情失敗'
      };
    
    case ActionType.CREATE_ARTICLE_SUCCESS:
      return {
        ...state,
        list: [action.payload, ...state.list],
        current: action.payload,
        loading: false,
        error: null
      };
    
    case ActionType.UPDATE_ARTICLE_SUCCESS:
      return {
        ...state,
        list: state.list.map(article => 
          article.id === action.payload.id ? action.payload : article
        ),
        current: action.payload,
        loading: false,
        error: null
      };
    
    case ActionType.DELETE_ARTICLE_SUCCESS:
      return {
        ...state,
        list: state.list.filter(article => article.id !== action.payload),
        current: state.current?.id === action.payload ? null : state.current,
        loading: false,
        error: null
      };
    
    case ActionType.SET_ARTICLE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        },
        // 設置新的篩選條件時，重置分頁
        pagination: {
          ...state.pagination,
          page: 1
        }
      };
    
    default:
      return state;
  }
};