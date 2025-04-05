/**
 * 處理標籤數據的 reducer
 */
import { Action, ActionType } from '../../types/state';
import { Tag } from '../../types/api';

// 標籤狀態接口
export interface TagsState {
  list: Tag[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// 初始標籤狀態
export const initialTagsState: TagsState = {
  list: [],
  loading: false,
  error: null,
  lastFetched: null // 最後獲取時間，用於緩存控制
};

// 緩存有效時間（毫秒）: 10分鐘
const CACHE_VALIDITY = 10 * 60 * 1000;

// 檢查是否需要從服務器獲取標籤
export const shouldFetchTags = (state: TagsState): boolean => {
  if (state.lastFetched === null || (Date.now() - state.lastFetched) > CACHE_VALIDITY) {
    return true;
  }
  
  if (state.list.length === 0 && state.error) {
    return true;
  }
  
  return false;
};

// 標籤 reducer
export const tagsReducer = (state: TagsState = initialTagsState, action: Action): TagsState => {
  switch (action.type) {
    case ActionType.FETCH_TAGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ActionType.FETCH_TAGS_SUCCESS:
      return {
        ...state,
        list: action.payload,
        loading: false,
        error: null,
        lastFetched: Date.now()
      };
    
    case ActionType.FETCH_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || '獲取標籤列表失敗'
      };
    
    case ActionType.CREATE_TAG_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        loading: false,
        error: null
      };
    
    case ActionType.UPDATE_TAG_SUCCESS:
      return {
        ...state,
        list: state.list.map(tag => 
          tag.id === action.payload.id ? action.payload : tag
        ),
        loading: false,
        error: null
      };
    
    case ActionType.DELETE_TAG_SUCCESS:
      return {
        ...state,
        list: state.list.filter(tag => tag.id !== action.payload),
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};