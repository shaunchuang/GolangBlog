/**
 * 應用全局狀態管理 Context
 */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { AppState, Action } from '../types/state';
import { authReducer, initialAuthState } from './reducers/authReducer';
import { articlesReducer, initialArticlesState } from './reducers/articlesReducer';
import { tagsReducer, initialTagsState } from './reducers/tagsReducer';
import { categoriesReducer, initialCategoriesState } from './reducers/categoriesReducer';
import { languagesReducer, initialLanguagesState } from './reducers/languagesReducer';
import { uiReducer, initialUiState } from './reducers/uiReducer';

// 創建初始應用狀態
export const initialAppState: AppState = {
  auth: initialAuthState,
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