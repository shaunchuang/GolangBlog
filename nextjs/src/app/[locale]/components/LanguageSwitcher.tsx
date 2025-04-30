'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, Locale } from '../../../../src/locales';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 從URL中獲取當前語言，添加簡單的默認值處理
  const pathParts = pathname.split('/');
  const currentLocale = pathParts.length > 1 ? pathParts[1] : 'zh-TW';

  // 語言顯示名稱對應
  const languageNames: Record<string, string> = {
    'en': 'English',
    'th': 'ไทย',
    'vi': 'Tiếng Việt',
    'id': 'Bahasa Indonesia',
    'ko': '한국어',
    'ja': '日本語',
    'zh-TW': '繁體中文 (台灣)',
    'zh-CN': '简体中文 (中国)',
    'zh-MY': '简体中文 (马来西亚)',
    'zh-SG': '简体中文 (新加坡)',
    'zh-MO': '繁體中文 (澳門)'
  };

  // 處理異常情況，確保即使 pathname 不符合預期格式也能正常工作
  let newPathGenerator = (locale: string) => {
    try {
      return pathname.replace(/^\/[^\/]+/, `/${locale}`);
    } catch (error) {
      console.error("Error generating path:", error);
      return `/${locale}`;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="language-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {languageNames[currentLocale] || '繁體中文 (台灣)'}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1 max-h-96 overflow-y-auto" role="none">
            {locales.map((locale: Locale) => {
              const newPath = newPathGenerator(locale);
              
              return (
                <Link
                  key={locale}
                  href={newPath}
                  className={`block px-4 py-2 text-sm ${
                    locale === currentLocale ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {languageNames[locale]}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}