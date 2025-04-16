import { UIState } from '@/types/state';
import { ActionType } from '@/types/state';

// UI狀態的初始值
export const initialUIState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: []
};

// 處理UI相關的狀態管理
export const uiReducer = (state = initialUIState, action: any) => {
  switch (action.type) {
    case ActionType.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };

    case ActionType.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };

    case ActionType.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };

    case ActionType.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload
      };

    case ActionType.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case ActionType.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };

    case ActionType.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };

    default:
      return state;
  }
};