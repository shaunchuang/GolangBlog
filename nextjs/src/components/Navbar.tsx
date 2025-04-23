"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faNewspaper, faTags, faBook, faCar, faLaptop, faMoneyBill, 
  faGlobe, faUtensils, faBoxOpen, faPlaneDeparture, faBook as faJournal,
  faTools, faCalculator, faExchangeAlt, faGasPump, faFileCode, faRulerCombined,
  faUserShield, faListAlt, faEdit, faCogs, faSignInAlt, faSignOutAlt, faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { ActionType } from '@/types/state';
import { authService } from '@/services/authService';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useAppContext();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated, user } = state.auth;
  
  // 添加調試日誌
  useEffect(() => {
    console.log('Navbar 渲染 - 認證狀態:', state.auth);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    if (typeof window !== 'undefined') {
      console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
    }
  }, [state.auth, isAuthenticated, user]);

  // 檢查用戶是否有管理員權限
  const hasAdminAccess = () => {
    console.log('檢查用戶角色:', user?.role);
    return user && ['admin', 'editor'].includes(user.role);
  };

  // 登出處理函數
  const handleLogout = () => {
    console.log('執行登出操作');
    authService.logout();
    dispatch({ type: ActionType.LOGOUT });
    window.location.href = '/';
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // 處理下拉選單的開啟和關閉
  const handleDropdownToggle = (dropdownId: string) => {
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownId);
    }
  };

  // 關閉所有下拉選單
  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  // 點擊頁面其他地方時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar') && !target.closest('.dropdown-menu-container')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 navbar">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-3">
            {/* 行動版導航按鈕 */}
            <button 
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => {
                const navContent = document.getElementById('navbarContent');
                if (navContent) {
                  navContent.classList.toggle('hidden');
                  navContent.classList.toggle('block');
                }
              }}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            
            <div className="hidden lg:flex lg:flex-grow lg:items-center w-full lg:w-auto" id="navbarContent">
              <ul className="flex flex-col lg:flex-row lg:space-x-4 w-full lg:w-auto">
                <li>
                  <Link 
                    href="/" 
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md"
                    onClick={closeAllDropdowns}
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-1" />
                    <span>{t('nav.home')}</span>
                  </Link>
                </li>
                
                {/* News Dropdown */}
                <li className="relative">
                  <button 
                    className={`flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md focus:outline-none ${activeDropdown === 'newsDropdown' ? 'text-blue-600 dark:text-blue-400' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('newsDropdown');
                    }}
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="mr-1" />
                    <span>{t('nav.news')}</span>
                    <svg className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'newsDropdown' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
                
                {/* Life Logs Dropdown */}
                <li className="relative">
                  <button 
                    className={`flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md focus:outline-none ${activeDropdown === 'lifeLogsDropdown' ? 'text-blue-600 dark:text-blue-400' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('lifeLogsDropdown');
                    }}
                  >
                    <FontAwesomeIcon icon={faBook} className="mr-1" />
                    <span>{t('nav.lifeLogs')}</span>
                    <svg className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'lifeLogsDropdown' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
                
                {/* Categories Dropdown */}
                <li className="relative">
                  <button 
                    className={`flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md focus:outline-none ${activeDropdown === 'categoriesDropdown' ? 'text-blue-600 dark:text-blue-400' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('categoriesDropdown');
                    }}
                  >
                    <FontAwesomeIcon icon={faTags} className="mr-1" />
                    <span>{t('nav.categories')}</span>
                    <svg className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'categoriesDropdown' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
                
                {/* Tools Dropdown */}
                <li className="relative">
                  <button 
                    className={`flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md focus:outline-none ${activeDropdown === 'toolsDropdown' ? 'text-blue-600 dark:text-blue-400' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('toolsDropdown');
                    }}
                  >
                    <FontAwesomeIcon icon={faTools} className="mr-1" />
                    <span>{t('nav.tools')}</span>
                    <svg className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'toolsDropdown' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
                
                {/* 管理選項 - 僅對管理員和編輯者顯示 */}
                {hasAdminAccess() && (
                  <li className="relative">
                    <button 
                      className={`flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md focus:outline-none ${activeDropdown === 'adminDropdown' ? 'text-blue-600 dark:text-blue-400' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDropdownToggle('adminDropdown');
                      }}
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-1" />
                      <span>管理</span>
                      <svg className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'adminDropdown' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
              
              <div className="flex flex-col lg:flex-row lg:ml-auto items-center mt-3 lg:mt-0">
                {/* 用戶認證選項 */}
                {isAuthenticated ? (
                  <div className="flex items-center mr-3">
                    <span className="mr-3 text-gray-700 dark:text-gray-300">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                      歡迎，<strong>{user?.username || '用戶'}</strong>
                      <small className="text-gray-500 ml-2">({user?.role || '用戶'})</small>
                    </span>
                    <button 
                      className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50 transition duration-200"
                      onClick={handleLogout}
                      title="登出"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                      登出
                    </button>
                  </div>
                ) : (
                  <div className="flex mr-3">
                    <Link href="/login" className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition duration-200 mr-2">
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-1" />
                      登入
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-white text-gray-700 border border-gray-500 rounded hover:bg-gray-50 transition duration-200">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-1" />
                      註冊
                    </Link>
                  </div>
                )}
                
                {/* 語言切換選項 */}
                <div className="relative mt-3 lg:mt-0">
                  <button
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition duration-200 flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('languageDropdown');
                    }}
                  >
                    {t('nav.language')}
                    <svg className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'languageDropdown' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {activeDropdown === 'languageDropdown' && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                      <button 
                        className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          changeLanguage('en');
                          closeAllDropdowns();
                        }}
                      >
                        English
                      </button>
                      <button 
                        className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          changeLanguage('zh');
                          closeAllDropdowns();
                        }}
                      >
                        中文
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 下拉選單容器 */}
      {activeDropdown && activeDropdown !== 'languageDropdown' && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md dropdown-menu-container">
          <div className="container mx-auto px-4 py-3">
            {/* News Dropdown Content */}
            {activeDropdown === 'newsDropdown' && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">最新新聞動態</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/news?category=car" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200" onClick={closeAllDropdowns}>
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full mb-2">
                      <FontAwesomeIcon icon={faCar} size="lg" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">汽車</span>
                  </Link>
                  <Link href="/news?category=tech" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200" onClick={closeAllDropdowns}>
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full mb-2">
                      <FontAwesomeIcon icon={faLaptop} size="lg" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">科技</span>
                  </Link>
                  <Link href="/news?category=finance" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200" onClick={closeAllDropdowns}>
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full mb-2">
                      <FontAwesomeIcon icon={faMoneyBill} size="lg" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">財經</span>
                  </Link>
                  <Link href="/news?category=world" className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200" onClick={closeAllDropdowns}>
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full mb-2">
                      <FontAwesomeIcon icon={faGlobe} size="lg" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">國際</span>
                  </Link>
                </div>
              </div>
            )}

            {/* 其他導航下拉選單內容同樣結構 */}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;