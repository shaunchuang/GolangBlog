'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faLandmark, faChartLine, faLaptopCode, faSearch, faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  // 添加客戶端渲染檢測
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  // 使用 optional chaining 並提供默認值，以避免客戶端渲染期間的 undefined 問題
  const locale = String(params?.locale || 'en');
  const t = useTranslations('navigation');

  // 客戶端初始化
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 處理滾動事件以控制導航欄的陰影
  useEffect(() => {
    // 確保只在客戶端執行
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // 初始檢測
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]); // 依賴於 isClient
  
  // 點擊頁面其他區域時關閉搜索框
  useEffect(() => {
    // 確保只在客戶端執行
    if (!isClient) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSearchExpanded && !target.closest('.search-container')) {
        setIsSearchExpanded(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isClient, isSearchExpanded]); // 依賴於 isClient
  
  // 處理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // 提交搜索
    router.push(`/${locale}/search?q=${encodeURIComponent(searchTerm)}`);
    setIsSearchExpanded(false);
    setSearchTerm('');
  };
  
  // 檢查導航項是否為當前活動頁面
  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname === `/${locale}${path}/`;
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white ${
      isClient && isScrolled ? 'shadow-md' : ''
    } transition-shadow duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 網站 Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center">
              <Image
                src="/globe.svg"
                alt="SJ Sphere News"
                width={36}
                height={36}
                className="mr-2"
              />
              <span className="text-xl font-bold text-blue-600">SJ Sphere</span>
            </Link>
          </div>
          
          {/* 主導航 - 僅在桌面版顯示 */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href={`/${locale}`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors flex items-center space-x-1`}
            >
              <FontAwesomeIcon icon={faHome} className="h-4 w-4" />
              <span className="ml-1">{t('home')}</span>
            </Link>
            <Link
              href={`/${locale}/news`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/news') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors flex items-center space-x-1`}
            >
              <FontAwesomeIcon icon={faNewspaper} className="h-4 w-4" />
              <span className="ml-1">{t('news')}</span>
            </Link>
            <Link
              href={`/${locale}/category/politics`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/category/politics') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors flex items-center space-x-1`}
            >
              <FontAwesomeIcon icon={faLandmark} className="h-4 w-4" />
              <span className="ml-1">{t('politics')}</span>
            </Link>
            <Link
              href={`/${locale}/category/business`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/category/business') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors flex items-center space-x-1`}
            >
              <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
              <span className="ml-1">{t('business')}</span>
            </Link>
            <Link
              href={`/${locale}/category/technology`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/category/technology') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors flex items-center space-x-1`}
            >
              <FontAwesomeIcon icon={faLaptopCode} className="h-4 w-4" />
              <span className="ml-1">{t('technology')}</span>
            </Link>
          </nav>
          
          {/* 右側工具欄 */}
          <div className="flex items-center">
            {/* 搜索按鈕與輸入框 */}
            <div className="search-container relative mr-3">
              {isSearchExpanded ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search')}
                    className="w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchExpanded(true);
                  }}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  aria-label="Search"
                  title="Search"
                >
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* 使用者選單 */}
            <div className="hidden md:block">
              <Link
                href={`/${locale}/login`}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
              >
                登入
              </Link>
              <Link
                href={`/${locale}/register`}
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                註冊
              </Link>
            </div>
            
            {/* 語言選擇器 */}
            <div className="relative ml-3">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                aria-label="Change language"
                title="Change language"
              >
                <FontAwesomeIcon icon={faGlobe} className="h-5 w-5" />
              </button>
              
              {/* 語言下拉選單 - 未實現狀態 */}
            </div>
            
            {/* 行動版選單開關 */}
            <div className="flex md:hidden ml-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {!isMobileMenuOpen ? (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 行動版選單 */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href={`/${locale}`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors flex items-center`}
          >
            <FontAwesomeIcon icon={faHome} className="h-5 w-5 mr-2" />
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/news`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/news') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors flex items-center`}
          >
            <FontAwesomeIcon icon={faNewspaper} className="h-5 w-5 mr-2" />
            {t('news')}
          </Link>
          <Link
            href={`/${locale}/category/politics`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/category/politics') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors flex items-center`}
          >
            <FontAwesomeIcon icon={faLandmark} className="h-5 w-5 mr-2" />
            {t('politics')}
          </Link>
          <Link
            href={`/${locale}/category/business`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/category/business') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors flex items-center`}
          >
            <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 mr-2" />
            {t('business')}
          </Link>
          <Link
            href={`/${locale}/category/technology`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/category/technology') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors flex items-center`}
          >
            <FontAwesomeIcon icon={faLaptopCode} className="h-5 w-5 mr-2" />
            {t('technology')}
          </Link>
          
          {/* 行動版搜索輸入框 */}
          <form onSubmit={handleSearchSubmit} className="px-3 py-2">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search')}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
              </button>
            </div>
          </form>
          
          {/* 行動版用戶登入選項 */}
          <div className="px-3 py-2 flex space-x-2">
            <Link
              href={`/${locale}/login`}
              className="flex-1 text-center px-3 py-2 rounded-md text-base font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              登入
            </Link>
            <Link
              href={`/${locale}/register`}
              className="flex-1 text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              註冊
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}