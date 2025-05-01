'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export default function UserMenu() {
  const t = useTranslations('User');
  const [isOpen, setIsOpen] = useState(false);
  // 模擬用戶狀態，實際應用中應從認證服務取得
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = () => {
    // 實際應用中這裡應該導向登入頁面或打開登入模態框
    setIsLoggedIn(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    // 實際應用中應呼叫登出 API
    setIsLoggedIn(false);
    setIsOpen(false);
  };

  return (
    <div className="relative ml-3">
      <div>
        <button
          type="button"
          className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="user-menu"
          aria-expanded="false"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {isLoggedIn ? (
              <Image
                className="h-8 w-8 rounded-full"
                src="https://news.sj-sphere.com/placeholder-avatar.jpg"
                alt={t('userAvatar')}
                width={32}
                height={32}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/user.svg';
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon="user"
                className="h-5 w-5 text-gray-500"
              />
            )}
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon="user-circle" className="mr-2 h-4 w-4" />
                {t('profile')}
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon="gear" className="mr-2 h-4 w-4" />
                {t('settings')}
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon="sign-out-alt" className="mr-2 h-4 w-4" />
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
                onClick={handleLogin}
              >
                <FontAwesomeIcon icon="sign-in-alt" className="mr-2 h-4 w-4" />
                {t('login')}
              </button>
              <Link
                href="/register"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon="user-plus" className="mr-2 h-4 w-4" />
                {t('register')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}