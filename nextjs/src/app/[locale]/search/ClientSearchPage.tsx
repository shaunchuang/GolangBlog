'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import apiService, { Article, SearchResponse } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';

interface ClientSearchPageProps {
  query: string;
  page: number;
  locale: string;
}

export default function ClientSearchPage({ query, page, locale }: ClientSearchPageProps) {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(query);
  const router = useRouter();
  const t = useTranslations('Common');
  
  // 執行搜索
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await apiService.searchArticles(query, page, 10, locale);
        setSearchResults(results);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(t('searchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query, page, locale, t]);
  
  // 處理搜索表單提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // 導航到新的搜索頁面
    router.push(`/${locale}/search?q=${encodeURIComponent(searchTerm)}`);
  };
  
  // 處理頁碼變更
  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;
    
    router.push(`/${locale}/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {query ? t('searchResults') : t('search')}
        </h1>
        
        {/* 搜索表單 */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
            >
              {t('searchButton')}
            </button>
          </div>
        </form>
        
        {/* 載入中狀態 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-600">{t('searching')}...</p>
          </div>
        )}
        
        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* 無結果訊息 */}
        {!isLoading && searchResults && searchResults.articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 mb-4">{t('noSearchResults')}</p>
            <p className="text-gray-500">{t('tryDifferentKeywords')}</p>
          </div>
        )}
        
        {/* 搜索結果 */}
        {!isLoading && searchResults && searchResults.articles.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">
              {t('foundResults', { 
                count: searchResults.totalArticles,
                query: query
              })}
            </p>
            
            <div className="space-y-6">
              {searchResults.articles.map((article) => (
                <ArticleCard 
                  key={article.id}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
            
            {/* 分頁控制 */}
            {searchResults.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={searchResults.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}