import { AuthState } from '@/types/state';
import { ActionType } from '@/types/state';

// 認證狀態的初始值
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// 處理認證相關的狀態管理
export const authReducer = (state = initialAuthState, action: any) => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };

    case ActionType.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };

    case ActionType.REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ActionType.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };

    case ActionType.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActionType.LOGOUT:
      return {
        ...initialAuthState
      };

    case ActionType.AUTH_STATE_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };

    case ActionType.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    default:
      return state;
  }
};