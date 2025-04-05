/**
 * 應用全局狀態管理 Context
 */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { AppState, Action, ActionType } from '../types/state';
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

// 創建 Context
export const AppStateContext = createContext<AppState>(initialAppState);
export const AppDispatchContext = createContext<React.Dispatch<Action>>(() => null);

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
interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialAppState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// 自定義 hooks 方便在組件中使用狀態和 dispatch
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState 必須在 AppStateProvider 內使用');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch 必須在 AppStateProvider 內使用');
  }
  return context;
};