'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, AuthUser, ActionType } from '@/types/state';
import { authService } from '@/services/authService';

// 初始狀態
const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  },
  ui: {
    theme: 'light',
    language: 'zh',
    sidebarOpen: false,
    notifications: [] // Add missing notifications array
  },
  articles: {
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
  },
  categories: {
    items: [],
    loading: false,
    error: null
  },
  tags: {
    items: [],
    loading: false,
    error: null
  }
};

// 創建上下文
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Reducer 函數
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // 認證相關 actions
    case ActionType.LOGIN_REQUEST:
    case ActionType.REGISTER_REQUEST:
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
          error: null
        }
      };
    case ActionType.LOGIN_SUCCESS:
    case ActionType.REGISTER_SUCCESS:
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          loading: false,
          error: null
        }
      };
    case ActionType.LOGIN_FAILURE:
    case ActionType.REGISTER_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          error: action.payload
        }
      };
    case ActionType.LOGOUT:
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        }
      };
    case ActionType.AUTH_ERROR:
      return {
        ...state,
        auth: {
          ...state.auth,
          error: action.payload
        }
      };

    // UI 相關 actions
    case ActionType.TOGGLE_THEME:
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: state.ui.theme === 'light' ? 'dark' : 'light'
        }
      };
    case ActionType.SET_LANGUAGE:
      return {
        ...state,
        ui: {
          ...state.ui,
          language: action.payload
        }
      };
    case ActionType.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen
        }
      };
    default:
      return state;
  }
};

// Provider 組件
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 在應用初始化時檢查用戶是否已登入
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === 'undefined') {
        return; // Skip on server-side
      }
      
      // 檢查 localStorage 中是否有 token
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return;
      }
      
      try {
        // 設置 token 到 API 服務的頭部
        authService.setAuthToken(token);
        
        // 獲取用戶信息
        const userResponse = await authService.getCurrentUser();
        
        // 將 User 類型轉換為 AuthUser 類型
        const userData = userResponse.data;
        const authUser: AuthUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          createdAt: userData.created_at
        };
        
        // 更新狀態
        dispatch({
          type: ActionType.LOGIN_SUCCESS,
          payload: { token, user: authUser }
        });
      } catch (err) {
        console.error('加載用戶失敗:', err);
        
        // 清除無效的 token
        localStorage.removeItem('auth_token');
        
        dispatch({
          type: ActionType.AUTH_ERROR,
          payload: '會話已過期，請重新登入'
        });
      }
    };

    loadUser();
  }, []);

  // 監聽 auth 狀態變化
  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Skip on server-side
    }
    
    // 當用戶登入時，保存 token 到 localStorage
    if (state.auth.token) {
      localStorage.setItem('auth_token', state.auth.token);
      authService.setAuthToken(state.auth.token);
    } else {
      // 當登出時，清除 token
      localStorage.removeItem('auth_token');
      authService.removeAuthToken();
    }
  }, [state.auth.token]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 自定義 hook 讓組件更容易使用 context
export const useAppContext = () => useContext(AppContext);

export default AppContext;