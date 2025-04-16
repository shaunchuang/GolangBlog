import { CategoriesState } from '@/types/state';
import { ActionType } from '@/types/state';

// 分類狀態的初始值
export const initialCategoriesState: CategoriesState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  }
};

// 處理分類相關的狀態管理
export const categoriesReducer = (state = initialCategoriesState, action: any) => {
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

    case ActionType.FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.FETCH_CATEGORY_DETAIL_REQUEST:
      return {
        ...state,
        current: null,
        loading: true,
        error: null
      };

    case ActionType.FETCH_CATEGORY_DETAIL_SUCCESS:
      return {
        ...state,
        current: action.payload.data,
        loading: false,
        error: null
      };

    case ActionType.FETCH_CATEGORY_DETAIL_FAILURE:
      return {
        ...state,
        current: null,
        loading: false,
        error: action.payload
      };

    case ActionType.CREATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        // 將新建的分類添加到列表
        items: [...state.items, action.payload.data],
        loading: false,
        error: null
      };

    case ActionType.CREATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        // 更新列表中對應的分類
        items: state.items.map(item => 
          item.id === action.payload.data.id ? action.payload.data : item
        ),
        current: action.payload.data,
        loading: false,
        error: null
      };

    case ActionType.UPDATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        // 從列表中移除被刪除的分類
        items: state.items.filter(item => item.id !== action.payload),
        loading: false,
        error: null
      };

    case ActionType.DELETE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.CLEAR_CATEGORY_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};