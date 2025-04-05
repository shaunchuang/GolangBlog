/**
 * 應用狀態類型定義
 */

import { User } from './api';
import { AuthState } from '../contexts/reducers/authReducer';
import { ArticlesState } from '../contexts/reducers/articlesReducer';
import { TagsState } from '../contexts/reducers/tagsReducer';
import { CategoriesState } from '../contexts/reducers/categoriesReducer';
import { LanguagesState } from '../contexts/reducers/languagesReducer';
import { UiState } from '../contexts/reducers/uiReducer';

// 完整的應用狀態接口
export interface AppState {
  auth: AuthState;
  articles: ArticlesState;
  tags: TagsState;
  categories: CategoriesState;
  languages: LanguagesState;
  ui: UiState;
}

// 所有可能的操作類型枚舉
export enum ActionType {
  // 認證相關
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',
  
  // 文章相關
  FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST',
  FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS',
  FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE',
  FETCH_ARTICLE_REQUEST = 'FETCH_ARTICLE_REQUEST',
  FETCH_ARTICLE_SUCCESS = 'FETCH_ARTICLE_SUCCESS',
  FETCH_ARTICLE_FAILURE = 'FETCH_ARTICLE_FAILURE',
  CREATE_ARTICLE_REQUEST = 'CREATE_ARTICLE_REQUEST',
  CREATE_ARTICLE_SUCCESS = 'CREATE_ARTICLE_SUCCESS',
  CREATE_ARTICLE_FAILURE = 'CREATE_ARTICLE_FAILURE',
  UPDATE_ARTICLE_REQUEST = 'UPDATE_ARTICLE_REQUEST',
  UPDATE_ARTICLE_SUCCESS = 'UPDATE_ARTICLE_SUCCESS',
  UPDATE_ARTICLE_FAILURE = 'UPDATE_ARTICLE_FAILURE',
  DELETE_ARTICLE_REQUEST = 'DELETE_ARTICLE_REQUEST',
  DELETE_ARTICLE_SUCCESS = 'DELETE_ARTICLE_SUCCESS',
  DELETE_ARTICLE_FAILURE = 'DELETE_ARTICLE_FAILURE',
  SET_ARTICLE_FILTERS = 'SET_ARTICLE_FILTERS',
  
  // 標籤相關
  FETCH_TAGS_REQUEST = 'FETCH_TAGS_REQUEST',
  FETCH_TAGS_SUCCESS = 'FETCH_TAGS_SUCCESS',
  FETCH_TAGS_FAILURE = 'FETCH_TAGS_FAILURE',
  
  // 分類相關
  FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST',
  FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS',
  FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE',
  
  // 語言相關
  FETCH_LANGUAGES_REQUEST = 'FETCH_LANGUAGES_REQUEST',
  FETCH_LANGUAGES_SUCCESS = 'FETCH_LANGUAGES_SUCCESS',
  FETCH_LANGUAGES_FAILURE = 'FETCH_LANGUAGES_FAILURE',
  SET_LANGUAGE = 'SET_LANGUAGE',
  
  // UI 相關
  TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE',
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
  ADD_ALERT = 'ADD_ALERT',
  DISMISS_ALERT = 'DISMISS_ALERT'
}

// 通用 Action 接口
export interface Action {
  type: ActionType;
  payload?: any;
}

// 特定領域的 Action 類型
export type AuthAction = Action;
export type ArticlesAction = Action;
export type TagsAction = Action;
export type CategoriesAction = Action;
export type LanguagesAction = Action;
export type UiAction = Action;