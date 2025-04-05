/**
 * 處理文章數據的 reducer
 */
import { Article } from '../../types/api';
import { Action, ActionType } from '../../types/state';

// State structure for articles
export interface ArticlesState {
  items: Article[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  lastFetched: number | null; // Add this property
}

// Initial state
export const initialArticlesState: ArticlesState = {
  items: [],
  currentArticle: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  },
  lastFetched: null // Initialize with null
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
  if (state.items.length === 0 && state.error) {
    return true;
  }
  
  return false;
};

// Articles reducer
export const articlesReducer = (state: ArticlesState = initialArticlesState, action: Action): ArticlesState => {
  switch (action.type) {
    // Fetching multiple articles
    case ActionType.FETCH_ARTICLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionType.FETCH_ARTICLES_SUCCESS:
      return {
        ...state,
        items: action.payload.items,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
        lastFetched: Date.now() // Update lastFetched when articles are successfully fetched
      };
    case ActionType.FETCH_ARTICLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetching a single article
    case ActionType.FETCH_ARTICLE_REQUEST:
      return {
        ...state,
        currentArticle: null,
        loading: true,
        error: null
      };
    case ActionType.FETCH_ARTICLE_SUCCESS:
      return {
        ...state,
        currentArticle: action.payload,
        loading: false,
        error: null
      };
    case ActionType.FETCH_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Creating an article
    case ActionType.CREATE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionType.CREATE_ARTICLE_SUCCESS:
      return {
        ...state,
        items: [action.payload, ...state.items],
        currentArticle: action.payload,
        loading: false,
        error: null
      };
    case ActionType.CREATE_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Updating an article
    case ActionType.UPDATE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionType.UPDATE_ARTICLE_SUCCESS:
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        currentArticle: action.payload,
        loading: false,
        error: null
      };
    case ActionType.UPDATE_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Deleting an article
    case ActionType.DELETE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionType.DELETE_ARTICLE_SUCCESS:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        loading: false,
        error: null
      };
    case ActionType.DELETE_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};