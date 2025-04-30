import { Metadata } from 'next';
import axios from 'axios';

// 環境判斷常數
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const API_BASE_URL = IS_PRODUCTION
  ? 'https://news.sj-sphere.com/api'
  : 'http://localhost:8080/api';
const IMAGE_BASE_URL = IS_PRODUCTION 
  ? 'https://news.sj-sphere.com/images/news' 
  : '/images/news';

// 獲取類別中文名稱
const getCategoryNameBySlug = (slug: string): string => {
  const categoryMap: Record<string, string> = {
    'news': '新聞',
    'politics': '政治',
    'business': '財經',
    'technology': '科技',
    'entertainment': '娛樂',
    'sports': '體育',
    'health': '健康',
    'lifestyle': '生活',
    'travel': '旅遊',
    'opinion': '評論',
    'world': '國際',
    'local': '本地',
  };
  
  return categoryMap[slug.toLowerCase()] || slug;
};

// 定義 Article 類型
interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  url: string;
}

// 定義頁面參數
interface CategoryPageParams {
  params: {
    slug: string;
    locale: string;
  };
  searchParams?: { page?: string };
}

// 動態生成元數據
export async function generateMetadata({ params }: CategoryPageParams): Promise<Metadata> {
  const { slug, locale } = params;
  const categoryName = getCategoryNameBySlug(slug);
  
  return {
    title: `${categoryName} | SJ Sphere News`,
    description: `最新最熱${categoryName}新聞，為您提供全球${categoryName}資訊、深度分析和專業報導`,
    keywords: [categoryName, '新聞', '報導', '最新消息', 'SJ Sphere'],
    openGraph: {
      title: `${categoryName} | SJ Sphere News`,
      description: `最新最熱${categoryName}新聞，為您提供全球${categoryName}資訊、深度分析和專業報導`,
      url: `https://news.sj-sphere.com/${locale}/category/${slug}`,
      siteName: 'SJ Sphere News',
      locale: locale,
      type: 'website',
    },
  };
}

// 請確保 messages 正確對應到當前 locale
export async function getRequestConfig({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  return {
    messages: (await import(`../../../../../messages/${locale}/messages.json`)).default,
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageParams) {
  const { slug, locale } = params;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  
  return (
    <div>
      <ClientCategoryPage slug={slug} locale={locale} page={page} />
    </div>
  );
}

// 客戶端類別頁面組件
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { zhTW, enUS, th, vi, id, ko, ja } from 'date-fns/locale';

// 支援的語言區域設定
const locales = {
  'en': enUS,
  'th': th,
  'vi': vi,
  'id': id,
  'ko': ko,
  'ja': ja,
  'zh-tw': zhTW,
  'zh-cn': zhTW, // 簡體中文暫時使用繁體中文的區域設定
  'zh-my': zhTW,
  'zh-sg': zhTW,
  'zh-mo': zhTW,
};

// 獲取當前語言的 date-fns 區域設定
const getLocale = (locale: string) => {
  const normalizedLocale = locale.toLowerCase();
  return locales[normalizedLocale as keyof typeof locales] || enUS;
};

// 根據環境處理圖片路徑
const getImageUrl = (imagePath: string) => {
  // 處理已經是完整URL的情況
  if (imagePath && imagePath.startsWith('http') && !imagePath.includes('news.sj-sphere.com')) {
    return imagePath;
  }
  
  if (!imagePath) return '/placeholder.jpg';
  
  // 提取檔案名稱
  const fileName = imagePath.replace(/^\/images\/news\//, '').split('/').pop() || '';
  return `${IMAGE_BASE_URL}/${fileName}`;
};

interface CategoryResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  totalArticles: number;
}

interface ClientCategoryPageProps {
  slug: string;
  locale: string;
  page: number;
}

function ClientCategoryPage({ slug, locale, page }: ClientCategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalPages: 1,
    totalArticles: 0
  });
  
  const router = useRouter();
  const t = useTranslations('Common');
  const categoryName = getCategoryNameBySlug(slug);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/articles?category=${slug}&page=${page}&limit=10&locale=${locale}`);
        const data = response.data as CategoryResponse;
        
        setArticles(data.articles);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalArticles: data.totalArticles
        });
      } catch (error) {
        console.error('Error fetching category articles:', error);
        setError('載入文章時發生錯誤，請稍後再試');
        
        // 在開發模式下生成測試數據
        if (!IS_PRODUCTION) {
          const dummyArticles = generateDummyArticles(slug);
          setArticles(dummyArticles);
          setPagination({
            currentPage: page,
            totalPages: 5,
            totalArticles: 50
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [slug, locale, page]);
  
  // 生成測試用的假文章列表
  const generateDummyArticles = (category: string): Article[] => {
    return Array.from({ length: 10 }, (_, index) => {
      const id = page * 10 - 10 + index + 1;
      return {
        id,
        title: `${categoryName}類別測試文章 #${id}`,
        excerpt: `這是一篇測試用的${categoryName}文章摘要，用於開發和測試類別頁面功能。`,
        image: `${category.toLowerCase()}-${(index % 3) + 1}.jpg`,
        category: categoryName,
        author: `測試作者 ${String.fromCharCode(65 + (index % 20))}`,
        date: new Date(Date.now() - index * 86400000).toISOString(),
        tags: ['測試', categoryName, '開發', `標籤 ${index + 1}`],
        url: `/news/${id}`
      };
    });
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      const dateObj = parseISO(dateString);
      if (isNaN(dateObj.getTime())) return '';
      
      return format(dateObj, 'yyyy年MM月dd日', { locale: getLocale(locale) });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  // 處理頁碼切換
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    // 使用路由導航到新頁面
    router.push(`/${locale}/category/${slug}?page=${newPage}`);
  };
  
  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }
  
  // 錯誤狀態
  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-md">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">{error}</h2>
          <p className="mt-2 text-gray-600">請稍後重試或回到首頁瀏覽其他內容。</p>
          <Link href={`/${locale}`} className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            回到首頁
          </Link>
        </div>
      </div>
    );
  }
  
  // 沒有文章的狀態
  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">{categoryName}</h1>
          <p className="text-xl text-gray-600 mb-6">此類別目前沒有文章。</p>
          <Link href={`/${locale}`} className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            瀏覽其他內容
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 類別頁面標題 */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{categoryName}</h1>
        <p className="text-lg text-gray-600">
          探索最新{categoryName}相關新聞、深度分析和專業報導
        </p>
      </div>
      
      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                />
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors">
                <Link href={`/${locale}/news/${article.id}`}>
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {formatDate(article.date)}
                </div>
                <Link
                  href={`/${locale}/news/${article.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t('readMore')}
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 分頁控制 */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                pagination.currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              上一頁
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, idx) => {
              let pageNum;
              
              // 算法：顯示當前頁碼附近的頁碼
              if (pagination.totalPages <= 5) {
                // 如果總頁數小於等於5，直接顯示所有頁碼
                pageNum = idx + 1;
              } else if (pagination.currentPage <= 3) {
                // 如果當前頁在前3頁，顯示1-5頁
                pageNum = idx + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                // 如果當前頁在後3頁，顯示最後5頁
                pageNum = pagination.totalPages - 4 + idx;
              } else {
                // 否則顯示當前頁及其前後共5頁
                pageNum = pagination.currentPage - 2 + idx;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-md ${
                    pagination.currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded-md ${
                pagination.currentPage === pagination.totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              下一頁
            </button>
          </nav>
        </div>
      )}
      
      {/* 總文章數顯示 */}
      <div className="text-center mt-4 text-sm text-gray-500">
        共 {pagination.totalArticles} 篇文章，當前顯示第 {pagination.currentPage} 頁
      </div>
    </div>
  );
}