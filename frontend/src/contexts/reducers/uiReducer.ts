/**
 * UI 相關狀態管理 reducer
 */
import { Action, ActionType } from '../../types/state';
import { v4 as uuidv4 } from 'uuid';

// 安裝 uuid 依賴（在使用前需要執行）
// npm install uuid @types/uuid

// UI 狀態接口
export interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  alerts: Array<{
    id: string;
    type: 'success' | 'warning' | 'danger' | 'info';
    message: string;
    dismissed: boolean;
  }>;
}

// 從本地存儲獲取深色模式設置
const getDefaultDarkMode = (): boolean => {
  const storedDarkMode = localStorage.getItem('dark_mode');
  if (storedDarkMode !== null) {
    return storedDarkMode === 'true';
  }
  
  // 如果沒有設置，則嘗試獲取用戶系統偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  
  return false;
};

// 初始 UI 狀態
export const initialUiState: UiState = {
  darkMode: getDefaultDarkMode(),
  sidebarOpen: true,
  alerts: []
};

// UI 狀態 reducer
export const uiReducer = (state: UiState = initialUiState, action: Action): UiState => {
  switch (action.type) {
    case ActionType.TOGGLE_DARK_MODE:
      const newDarkMode = action.payload !== undefined ? action.payload : !state.darkMode;
      // 保存設置到本地存儲
      localStorage.setItem('dark_mode', String(newDarkMode));
      return {
        ...state,
        darkMode: newDarkMode
      };
    
    case ActionType.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload !== undefined ? action.payload : !state.sidebarOpen
      };
    
    case ActionType.ADD_ALERT:
      return {
        ...state,
        alerts: [
          ...state.alerts,
          {
            id: uuidv4(),
            type: action.payload.type || 'info',
            message: action.payload.message,
            dismissed: false
          }
        ]
      };
    
    case ActionType.DISMISS_ALERT:
      return {
        ...state,
        alerts: state.alerts.map(alert => 
          alert.id === action.payload
            ? { ...alert, dismissed: true }
            : alert
        )
      };
    
    default:
      return state;
  }
};