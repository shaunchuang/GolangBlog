"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faUser, faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* 行動裝置側邊欄開關按鈕 */}
      <button
        className="fixed top-4 left-4 z-40 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 背景遮罩 - 只在側邊欄開啟時顯示 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 側邊欄 */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-800 w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-5">
          <div className="flex items-center justify-center mb-6">
            <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              Golang Blog
            </Link>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-3 w-5 h-5" />
                  <span>首頁</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faNewspaper} className="mr-3 w-5 h-5" />
                  <span>文章列表</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faTags} className="mr-3 w-5 h-5" />
                  <span>分類</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/archives"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 w-5 h-5" />
                  <span>文章歸檔</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3 w-5 h-5" />
                  <span>關於我</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;