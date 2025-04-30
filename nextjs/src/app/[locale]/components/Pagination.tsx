'use client';

import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations('Common');
  
  // 計算要顯示的頁碼範圍
  const getPageNumbers = () => {
    // 如果總頁數小於等於 7，直接顯示所有頁碼
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // 否則，顯示當前頁碼附近的頁碼，並在兩側添加省略號
    if (currentPage <= 3) {
      // 當前頁碼接近開始
      return [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      // 當前頁碼接近結束
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      // 當前頁碼在中間
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="flex justify-center my-8" aria-label="Pagination">
      {/* 上一頁按鈕 */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } border border-gray-300`}
      >
        {t('previous')}
      </button>
      
      {/* 頁碼按鈕 */}
      <div className="hidden md:flex">
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
            disabled={pageNumber === '...'}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${
              pageNumber === currentPage
                ? 'z-10 bg-blue-600 border-blue-600 text-white'
                : pageNumber === '...'
                ? 'bg-white text-gray-700 cursor-default'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      
      {/* 行動版頁碼指示器 */}
      <div className="flex md:hidden items-center border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
        {t('page')} {currentPage} / {totalPages}
      </div>
      
      {/* 下一頁按鈕 */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } border border-gray-300`}
      >
        {t('next')}
      </button>
    </nav>
  );
}