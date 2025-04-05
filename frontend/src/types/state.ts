/**
 * 應用狀態類型定義
 */

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

// Define application action types
export enum ActionType {
  // Auth actions
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  UPDATE_USER = 'UPDATE_USER',
  
  // Article actions
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
  
  // Other action types as needed
  FETCH_TAGS = 'FETCH_TAGS',
  FETCH_CATEGORIES = 'FETCH_CATEGORIES'
}

// Define base action interface
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

// Remove the circular import
// export { AppState } from '../contexts/AppContext';