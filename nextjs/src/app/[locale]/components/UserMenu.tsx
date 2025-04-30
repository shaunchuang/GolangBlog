'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserMenu() {
  // 暫時移除 useTranslations hook
  // const t = useTranslations('user');
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
                alt="User avatar"
                width={32}
                height={32}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/user.svg';
                }}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={handleLogin}
              >
                Login
              </button>
              <Link
                href="/register"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}