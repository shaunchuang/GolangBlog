import { TagsState } from '@/types/state';
import { ActionType } from '@/types/state';

// 標籤狀態的初始值
export const initialTagsState: TagsState = {
  items: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  }
};

// 處理標籤相關的狀態管理
export const tagsReducer = (state = initialTagsState, action: any) => {
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
        items: action.payload.data,
        pagination: {
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.page_size,
          totalPages: action.payload.total_pages
        },
        loading: false,
        error: null
      };

    case ActionType.FETCH_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.CREATE_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.CREATE_TAG_SUCCESS:
      return {
        ...state,
        // 將新建的標籤添加到列表
        items: [...state.items, action.payload.data],
        loading: false,
        error: null
      };

    case ActionType.CREATE_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.UPDATE_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.UPDATE_TAG_SUCCESS:
      return {
        ...state,
        // 更新列表中對應的標籤
        items: state.items.map(item => 
          item.id === action.payload.data.id ? action.payload.data : item
        ),
        loading: false,
        error: null
      };

    case ActionType.UPDATE_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.DELETE_TAG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.DELETE_TAG_SUCCESS:
      return {
        ...state,
        // 從列表中移除被刪除的標籤
        items: state.items.filter(item => item.id !== action.payload),
        loading: false,
        error: null
      };

    case ActionType.DELETE_TAG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.CLEAR_TAG_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};