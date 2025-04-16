import { ArticlesState } from '@/types/state';
import { ActionType } from '@/types/state';

// 文章狀態的初始值
export const initialArticlesState: ArticlesState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  }
};

// 處理文章相關的狀態管理
export const articlesReducer = (state = initialArticlesState, action: any) => {
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

    case ActionType.FETCH_ARTICLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.FETCH_ARTICLE_DETAIL_REQUEST:
      return {
        ...state,
        current: null,
        loading: true,
        error: null
      };

    case ActionType.FETCH_ARTICLE_DETAIL_SUCCESS:
      return {
        ...state,
        current: action.payload.data,
        loading: false,
        error: null
      };

    case ActionType.FETCH_ARTICLE_DETAIL_FAILURE:
      return {
        ...state,
        current: null,
        loading: false,
        error: action.payload
      };

    case ActionType.CREATE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.CREATE_ARTICLE_SUCCESS:
      return {
        ...state,
        // 將新建的文章添加到列表頂部
        items: [action.payload.data, ...state.items],
        loading: false,
        error: null
      };

    case ActionType.CREATE_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.UPDATE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.UPDATE_ARTICLE_SUCCESS:
      return {
        ...state,
        // 更新列表中對應的文章
        items: state.items.map(item => 
          item.id === action.payload.data.id ? action.payload.data : item
        ),
        current: action.payload.data,
        loading: false,
        error: null
      };

    case ActionType.UPDATE_ARTICLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.DELETE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.DELETE_ARTICLE_SUCCESS:
      return {
        ...state,
        // 從列表中移除被刪除的文章
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

    case ActionType.CLEAR_ARTICLE_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};