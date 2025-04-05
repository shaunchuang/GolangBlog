/**
 * 處理用戶認證的 reducer
 */
import { Action, ActionType } from '../../types/state';

// Define AuthState interface
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state for auth
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

// Auth reducer function
export const authReducer = (state: AuthState = initialAuthState, action: Action): AuthState => {
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
        token: action.payload.token,
        loading: false,
        error: null
      };
    case ActionType.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case ActionType.LOGOUT:
      return {
        ...initialAuthState
      };
    case ActionType.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};