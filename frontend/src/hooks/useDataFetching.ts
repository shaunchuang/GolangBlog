/**
 * 自定義 Hooks 用於數據獲取和狀態管理
 */
import { useEffect, useState, useCallback } from 'react';
import { useAppState, useAppDispatch } from '../contexts/AppContext';
import { ActionType } from '../types/state';
import { articleService, authService, categoryService, tagService } from '../services';
import { shouldFetchArticles } from '../contexts/reducers/articlesReducer';
import { shouldFetchTags } from '../contexts/reducers/tagsReducer';
import { shouldFetchCategories } from '../contexts/reducers/categoriesReducer';

/**
 * 處理用戶認證相關的 hook
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppState();
  
  // 登入
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: ActionType.LOGIN_REQUEST });
    
    try {
      const response = await authService.login({ email, password });
      dispatch({ 
        type: ActionType.LOGIN_SUCCESS, 
        payload: { user: response.user, token: response.token } 
      });
      
      // 添加成功通知
      dispatch({
        type: ActionType.ADD_ALERT,
        payload: { type: 'success', message: '登入成功！' }
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '登入失敗，請檢查您的憑證';
      
      dispatch({ 
        type: ActionType.LOGIN_FAILURE, 
        payload: errorMessage 
      });
      
      // 添加錯誤通知
      dispatch({
        type: ActionType.ADD_ALERT,
        payload: { type: 'danger', message: errorMessage }
      });
      
      throw error;
    }
  }, [dispatch]);
  
  // 登出
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: ActionType.LOGOUT });
    
    // 添加通知
    dispatch({
      type: ActionType.ADD_ALERT,
      payload: { type: 'info', message: '您已成功登出' }
    });
  }, [dispatch]);
  
  // 獲取當前用戶資料
  const fetchCurrentUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    
    dispatch({ type: ActionType.LOGIN_REQUEST });
    
    try {
      const response = await authService.getCurrentUser();
      
      dispatch({ 
        type: ActionType.LOGIN_SUCCESS, 
        payload: { user: response.data } 
      });
      
      return response.data;
    } catch (error: any) {
      // 如果獲取失敗，可能是 token 無效
      if (error.response?.status === 401) {
        authService.logout();
        dispatch({ type: ActionType.LOGOUT });
      }
      
      dispatch({ 
        type: ActionType.LOGIN_FAILURE, 
        payload: error.response?.data?.message || '獲取用戶資料失敗' 
      });
      
      return null;
    }
  }, [dispatch]);
  
  // 組件掛載時檢查用戶是否已認證
  useEffect(() => {
    if (authService.isAuthenticated() && !auth.user && !auth.loading) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, auth.user, auth.loading]);
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login,
    logout,
    fetchCurrentUser
  };
};

/**
 * 處理文章數據獲取的 hook
 */
export const useArticles = () => {
  const dispatch = useAppDispatch();
  const { articles } = useAppState();
  
  // 獲取文章列表
  const fetchArticles = useCallback(async (params?: any) => {
    dispatch({ type: ActionType.FETCH_ARTICLES_REQUEST });
    
    try {
      const response = await articleService.getArticles({
        ...articles.filters,
        page: articles.pagination.page,
        page_size: articles.pagination.pageSize,
        ...params
      });
      
      dispatch({ 
        type: ActionType.FETCH_ARTICLES_SUCCESS, 
        payload: response 
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '獲取文章列表失敗';
      
      dispatch({ 
        type: ActionType.FETCH_ARTICLES_FAILURE, 
        payload: errorMessage 
      });
      
      // 添加錯誤通知
      dispatch({
        type: ActionType.ADD_ALERT,
        payload: { type: 'danger', message: errorMessage }
      });
      
      throw error;
    }
  }, [dispatch, articles.filters, articles.pagination]);
  
  // 獲取單篇文章
  const fetchArticleById = useCallback(async (id: number | string) => {
    dispatch({ type: ActionType.FETCH_ARTICLE_REQUEST });
    
    try {
      const response = await articleService.getArticleById(id);
      
      dispatch({ 
        type: ActionType.FETCH_ARTICLE_SUCCESS, 
        payload: response.data 
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '獲取文章詳情失敗';
      
      dispatch({ 
        type: ActionType.FETCH_ARTICLE_FAILURE, 
        payload: errorMessage 
      });
      
      // 添加錯誤通知
      dispatch({
        type: ActionType.ADD_ALERT,
        payload: { type: 'danger', message: errorMessage }
      });
      
      throw error;
    }
  }, [dispatch]);
  
  // 設置篩選條件
  const setFilters = useCallback((filters: any) => {
    dispatch({
      type: ActionType.SET_ARTICLE_FILTERS,
      payload: filters
    });
  }, [dispatch]);
  
  // 初始加載或刷新數據
  useEffect(() => {
    if (shouldFetchArticles(articles)) {
      fetchArticles();
    }
  }, [fetchArticles]);
  
  return {
    articles: articles.list,
    currentArticle: articles.current,
    loading: articles.loading,
    error: articles.error,
    pagination: articles.pagination,
    filters: articles.filters,
    fetchArticles,
    fetchArticleById,
    setFilters
  };
};

/**
 * 處理標籤數據獲取的 hook
 */
export const useTags = () => {
  const dispatch = useAppDispatch();
  const { tags } = useAppState();
  
  // 獲取標籤列表
  const fetchTags = useCallback(async (params?: any) => {
    dispatch({ type: ActionType.FETCH_TAGS_REQUEST });
    
    try {
      const response = await tagService.getTags(params);
      
      dispatch({ 
        type: ActionType.FETCH_TAGS_SUCCESS, 
        payload: response 
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '獲取標籤列表失敗';
      
      dispatch({ 
        type: ActionType.FETCH_TAGS_FAILURE, 
        payload: errorMessage 
      });
      
      throw error;
    }
  }, [dispatch]);
  
  // 初始加載或刷新數據
  useEffect(() => {
    if (shouldFetchTags(tags)) {
      fetchTags();
    }
  }, [fetchTags, tags]);
  
  return {
    tags: tags.list,
    loading: tags.loading,
    error: tags.error,
    fetchTags
  };
};

/**
 * 處理分類數據獲取的 hook
 */
export const useCategories = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppState();
  
  // 獲取分類列表
  const fetchCategories = useCallback(async (params?: any) => {
    dispatch({ type: ActionType.FETCH_CATEGORIES_REQUEST });
    
    try {
      const response = await categoryService.getCategories(params);
      
      dispatch({ 
        type: ActionType.FETCH_CATEGORIES_SUCCESS, 
        payload: response 
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '獲取分類列表失敗';
      
      dispatch({ 
        type: ActionType.FETCH_CATEGORIES_FAILURE, 
        payload: errorMessage 
      });
      
      throw error;
    }
  }, [dispatch]);
  
  // 初始加載或刷新數據
  useEffect(() => {
    if (shouldFetchCategories(categories)) {
      fetchCategories();
    }
  }, [fetchCategories, categories]);
  
  return {
    categories: categories.list,
    loading: categories.loading,
    error: categories.error,
    fetchCategories
  };
};

/**
 * 處理 UI 狀態的 hook
 */
export const useUI = () => {
  const dispatch = useAppDispatch();
  const { ui } = useAppState();
  
  // 切換深色模式
  const toggleDarkMode = useCallback((value?: boolean) => {
    dispatch({
      type: ActionType.TOGGLE_DARK_MODE,
      payload: value
    });
  }, [dispatch]);
  
  // 切換側邊欄
  const toggleSidebar = useCallback((value?: boolean) => {
    dispatch({
      type: ActionType.TOGGLE_SIDEBAR,
      payload: value
    });
  }, [dispatch]);
  
  // 添加通知
  const addAlert = useCallback((type: 'success' | 'warning' | 'danger' | 'info', message: string) => {
    dispatch({
      type: ActionType.ADD_ALERT,
      payload: { type, message }
    });
  }, [dispatch]);
  
  // 關閉通知
  const dismissAlert = useCallback((id: string) => {
    dispatch({
      type: ActionType.DISMISS_ALERT,
      payload: id
    });
  }, [dispatch]);
  
  return {
    darkMode: ui.darkMode,
    sidebarOpen: ui.sidebarOpen,
    alerts: ui.alerts.filter(alert => !alert.dismissed),
    toggleDarkMode,
    toggleSidebar,
    addAlert,
    dismissAlert
  };
};