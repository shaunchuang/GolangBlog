'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const locale = String(params.locale || 'en');
  const t = useTranslations('navigation');
  
  // 處理滾動事件以控制導航欄的陰影
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 點擊頁面其他區域時關閉搜索框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSearchExpanded && !target.closest('.search-container')) {
        setIsSearchExpanded(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSearchExpanded]);
  
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
      isScrolled ? 'shadow-md' : ''
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
              } transition-colors`}
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/news`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/news') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors`}
            >
              {t('news')}
            </Link>
            <Link
              href={`/${locale}/category/politics`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/category/politics') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors`}
            >
              {t('politics')}
            </Link>
            <Link
              href={`/${locale}/category/business`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/category/business') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors`}
            >
              {t('business')}
            </Link>
            <Link
              href={`/${locale}/category/technology`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/category/technology') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
              } transition-colors`}
            >
              {t('technology')}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
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
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
            } transition-colors`}
          >
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/news`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/news') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors`}
          >
            {t('news')}
          </Link>
          <Link
            href={`/${locale}/category/politics`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/category/politics') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors`}
          >
            {t('politics')}
          </Link>
          <Link
            href={`/${locale}/category/business`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/category/business') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors`}
          >
            {t('business')}
          </Link>
          <Link
            href={`/${locale}/category/technology`}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/category/technology') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors`}
          >
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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