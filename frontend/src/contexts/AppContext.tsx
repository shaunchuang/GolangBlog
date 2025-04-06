/**
 * 應用全局狀態管理 Context
 */
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { AppState, Action, ActionType } from '../types/state';
import { authReducer, initialAuthState } from './reducers/authReducer';
import { articlesReducer, initialArticlesState } from './reducers/articlesReducer';
import { tagsReducer, initialTagsState } from './reducers/tagsReducer';
import { categoriesReducer, initialCategoriesState } from './reducers/categoriesReducer';
import { languagesReducer, initialLanguagesState } from './reducers/languagesReducer';
import { uiReducer, initialUiState } from './reducers/uiReducer';

// 創建初始應用狀態
export const initialAppState: AppState = {
  auth: {
    ...initialAuthState,
    // 檢查 localStorage 中的 token，如果存在則認為已登入
    isAuthenticated: !!localStorage.getItem('auth_token'),
    // 嘗試從 localStorage 中獲取用戶信息
    user: (() => {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          console.error('解析用戶信息失敗:', e);
          return null;
        }
      }
      return null;
    })(),
    // 直接從 localStorage 獲取 token
    token: localStorage.getItem('auth_token')
  },
  articles: initialArticlesState,
  tags: initialTagsState,
  categories: initialCategoriesState,
  languages: initialLanguagesState,
  ui: initialUiState
};

// Define the context value type that combines state and dispatch
export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

// 創建 Context
export const AppContext = createContext<AppContextValue>({
  state: initialAppState,
  dispatch: () => null
});

// 組合各個領域的 reducer
const rootReducer = (state: AppState, action: Action): AppState => {
  return {
    auth: authReducer(state.auth, action),
    articles: articlesReducer(state.articles, action),
    tags: tagsReducer(state.tags, action),
    categories: categoriesReducer(state.categories, action),
    languages: languagesReducer(state.languages, action),
    ui: uiReducer(state.ui, action)
  };
};

// Context Provider 組件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialAppState);

  // 啟動時檢查登入狀態並恢復用戶會話
  useEffect(() => {
    // 同時檢查 token 和 userInfo
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('auth_user');
    
    console.log('Token 存在:', !!token);
    console.log('User Info 存在:', !!userInfoStr);
    
    if (token && userInfoStr) {
      try {
        // 解析用戶信息
        const userInfo = JSON.parse(userInfoStr);
        console.log('恢復用戶信息:', userInfo);
        
        // 恢復登入狀態
        dispatch({
          type: ActionType.LOGIN_SUCCESS,
          payload: {
            user: userInfo,
            token: token
          }
        });
        console.log('成功恢復登入狀態!');
      } catch (error) {
        console.error('解析用戶信息失敗:', error);
        // 清除無效數據
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    } else {
      console.log('沒有發現登入信息或信息不完整');
    }
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 自定義 hook 方便在組件中使用 Context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext 必須在 AppProvider 內使用');
  }
  return context;
};