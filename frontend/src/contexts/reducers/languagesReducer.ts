/**
 * 語言相關狀態管理 reducer
 */
import { Action, ActionType } from '../../types/state';
import { Language } from '../../types/api';

// 語言狀態接口
export interface LanguagesState {
  list: Language[];
  current: string;
  loading: boolean;
  error: string | null;
}

// 從本地存儲或瀏覽器語言獲取預設語言
const getDefaultLanguage = (): string => {
  // 先檢查本地存儲
  const storedLanguage = localStorage.getItem('app_language');
  if (storedLanguage) {
    return storedLanguage;
  }
  
  // 從瀏覽器語言設置獲取
  const browserLang = navigator.language.split('-')[0]; // 'zh-TW' => 'zh'
  if (browserLang === 'zh') {
    return 'zh';
  }
  
  // 默認返回英文
  return 'en';
};

// 初始語言狀態
export const initialLanguagesState: LanguagesState = {
  list: [],
  current: getDefaultLanguage(),
  loading: false,
  error: null
};

// 語言狀態 reducer
export const languagesReducer = (state: LanguagesState = initialLanguagesState, action: Action): LanguagesState => {
  switch (action.type) {
    case ActionType.FETCH_LANGUAGES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ActionType.FETCH_LANGUAGES_SUCCESS:
      return {
        ...state,
        list: action.payload.data || action.payload,
        loading: false,
        error: null
      };
    case ActionType.FETCH_LANGUAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ActionType.SET_LANGUAGE:
      // 保存選擇的語言到本地存儲
      localStorage.setItem('app_language', action.payload);
      return {
        ...state,
        current: action.payload
      };
    default:
      return state;
  }
};