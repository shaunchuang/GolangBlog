/**
 * 處理用戶認證的 reducer
 */
import { Action, ActionType } from '../../types/state';
import { User } from '../../types/api';

// 認證狀態接口
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 初始認證狀態
export const initialAuthState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// 認證 reducer
export const authReducer = (state: AuthState = initialAuthState, action: Action): AuthState => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST:
    case ActionType.REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ActionType.LOGIN_SUCCESS:
      const { user, token } = action.payload;
      // 保存 token 到本地存儲
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return {
        ...state,
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case ActionType.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    case ActionType.LOGIN_FAILURE:
    case ActionType.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || '認證失敗'
      };
    
    case ActionType.LOGOUT:
      // 移除本地存儲的 token
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false
      };
    
    default:
      return state;
  }
};