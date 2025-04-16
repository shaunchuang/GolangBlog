import { User, Article, Category, Tag } from './api';

/**
 * 狀態管理相關的類型定義
 */

// 操作類型枚舉
export enum ActionType {
  // 認證相關
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  AUTH_STATE_LOADED = 'AUTH_STATE_LOADED',
  UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS',
  AUTH_ERROR = 'AUTH_ERROR',
  
  // 文章相關
  FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST',
  FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS',
  FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE',
  FETCH_ARTICLE_DETAIL_REQUEST = 'FETCH_ARTICLE_DETAIL_REQUEST',
  FETCH_ARTICLE_DETAIL_SUCCESS = 'FETCH_ARTICLE_DETAIL_SUCCESS',
  FETCH_ARTICLE_DETAIL_FAILURE = 'FETCH_ARTICLE_DETAIL_FAILURE',
  CREATE_ARTICLE_REQUEST = 'CREATE_ARTICLE_REQUEST',
  CREATE_ARTICLE_SUCCESS = 'CREATE_ARTICLE_SUCCESS',
  CREATE_ARTICLE_FAILURE = 'CREATE_ARTICLE_FAILURE',
  UPDATE_ARTICLE_REQUEST = 'UPDATE_ARTICLE_REQUEST',
  UPDATE_ARTICLE_SUCCESS = 'UPDATE_ARTICLE_SUCCESS',
  UPDATE_ARTICLE_FAILURE = 'UPDATE_ARTICLE_FAILURE',
  DELETE_ARTICLE_REQUEST = 'DELETE_ARTICLE_REQUEST',
  DELETE_ARTICLE_SUCCESS = 'DELETE_ARTICLE_SUCCESS',
  DELETE_ARTICLE_FAILURE = 'DELETE_ARTICLE_FAILURE',
  CLEAR_ARTICLE_ERROR = 'CLEAR_ARTICLE_ERROR',
  
  // 分類相關
  FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST',
  FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE',
  CREATE_CATEGORY_REQUEST = 'CREATE_CATEGORY_REQUEST',
  CREATE_CATEGORY_SUCCESS = 'CREATE_CATEGORY_SUCCESS',
  CREATE_CATEGORY_FAILURE = 'CREATE_CATEGORY_FAILURE',
  UPDATE_CATEGORY_REQUEST = 'UPDATE_CATEGORY_REQUEST',
  UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS',
  UPDATE_CATEGORY_FAILURE = 'UPDATE_CATEGORY_FAILURE',
  DELETE_CATEGORY_REQUEST = 'DELETE_CATEGORY_REQUEST',
  DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS',
  DELETE_CATEGORY_FAILURE = 'DELETE_CATEGORY_FAILURE',
  
  // 標籤相關
  FETCH_TAGS_REQUEST = 'FETCH_TAGS_REQUEST',
  FETCH_TAGS_SUCCESS = 'FETCH_TAGS_SUCCESS',
  FETCH_TAGS_FAILURE = 'FETCH_TAGS_FAILURE',
  CREATE_TAG_REQUEST = 'CREATE_TAG_REQUEST',
  CREATE_TAG_SUCCESS = 'CREATE_TAG_SUCCESS',
  CREATE_TAG_FAILURE = 'CREATE_TAG_FAILURE',
  UPDATE_TAG_REQUEST = 'UPDATE_TAG_REQUEST',
  UPDATE_TAG_SUCCESS = 'UPDATE_TAG_SUCCESS',
  UPDATE_TAG_FAILURE = 'UPDATE_TAG_FAILURE',
  DELETE_TAG_REQUEST = 'DELETE_TAG_REQUEST',
  DELETE_TAG_SUCCESS = 'DELETE_TAG_SUCCESS',
  DELETE_TAG_FAILURE = 'DELETE_TAG_FAILURE',
  
  // UI相關
  TOGGLE_THEME = 'TOGGLE_THEME',
  SET_THEME = 'SET_THEME',
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS',
  SET_LANGUAGE = 'SET_LANGUAGE'
}

// 認證相關類型
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

// 認證狀態介面
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 分頁介面
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 文章狀態介面
export interface ArticlesState {
  items: Article[];
  current: Article | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

// 分類狀態介面
export interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

// 標籤狀態介面
export interface TagsState {
  items: Tag[];
  loading: boolean;
  error: string | null;
}

// 通知介面
export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timeout?: number;
}

// UI 相關類型
export interface UIState {
  theme: 'light' | 'dark';
  language: string;
  sidebarOpen: boolean;
  notifications: Notification[];
}

// 應用狀態總介面
export interface AppState {
  auth: AuthState;
  articles: ArticlesState;
  categories: CategoriesState;
  tags: TagsState;
  ui: UIState;
}

// Action 介面
interface LoginRequestAction {
  type: ActionType.LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS;
  payload: {
    user: AuthUser;
    token: string;
  };
}

interface LoginFailureAction {
  type: ActionType.LOGIN_FAILURE;
  payload: string;
}

interface RegisterRequestAction {
  type: ActionType.REGISTER_REQUEST;
}

interface RegisterSuccessAction {
  type: ActionType.REGISTER_SUCCESS;
  payload: {
    user: AuthUser;
    token: string;
  };
}

interface RegisterFailureAction {
  type: ActionType.REGISTER_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: ActionType.LOGOUT;
}

interface AuthErrorAction {
  type: ActionType.AUTH_ERROR;
  payload: string;
}

interface ToggleThemeAction {
  type: ActionType.TOGGLE_THEME;
}

interface SetLanguageAction {
  type: ActionType.SET_LANGUAGE;
  payload: string;
}

interface ToggleSidebarAction {
  type: ActionType.TOGGLE_SIDEBAR;
}

interface FetchArticlesRequestAction {
  type: ActionType.FETCH_ARTICLES_REQUEST;
}

interface FetchArticlesSuccessAction {
  type: ActionType.FETCH_ARTICLES_SUCCESS;
  payload: {
    items: Article[];
    pagination: Pagination;
  };
}

interface FetchArticlesFailureAction {
  type: ActionType.FETCH_ARTICLES_FAILURE;
  payload: string;
}

// 所有可能的 Action 類型
export type AppAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | LogoutAction
  | AuthErrorAction
  | ToggleThemeAction
  | SetLanguageAction
  | ToggleSidebarAction
  | FetchArticlesRequestAction
  | FetchArticlesSuccessAction
  | FetchArticlesFailureAction;
