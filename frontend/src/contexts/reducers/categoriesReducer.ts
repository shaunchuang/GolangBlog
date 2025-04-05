/**
 * 分類相關狀態管理 reducer
 */
import { Action, ActionType } from '../../types/state';
import { Category } from '../../types/api';

// 分類狀態接口
export interface CategoriesState {
  list: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// 初始分類狀態
export const initialCategoriesState: CategoriesState = {
  list: [],
  loading: false,
  error: null,
  lastFetched: null
};

// 分類數據緩存時間 (毫秒)
const CACHE_DURATION = 10 * 60 * 1000; // 10分鐘

// 分類狀態 reducer
export const categoriesReducer = (state: CategoriesState = initialCategoriesState, action: Action): CategoriesState => {
  switch (action.type) {
    case ActionType.FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionType.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        list: action.payload.data || action.payload,
        loading: false,
        error: null,
        lastFetched: Date.now()
      };
    case ActionType.FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// 檢查數據是否需要刷新 (緩存策略)
export const shouldFetchCategories = (state: CategoriesState): boolean => {
  if (state.loading) return false;
  if (state.list.length === 0) return true;
  if (!state.lastFetched) return true;
  
  const now = Date.now();
  return now - state.lastFetched > CACHE_DURATION;
};