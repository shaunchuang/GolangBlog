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

// 定義相關文章類型
interface RelatedArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  url: string;
  content: string;
}

// 定義 Article 類型
interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  url: string;
  relatedArticles?: RelatedArticle[]; // 添加相關文章屬性，設為可選
}

// 定義要獲取的博客文章的類型安全參數
interface ArticlePageParams {
  params: {
    id: string;
    locale: string;
  };
}

// 動態元數據生成函數
export async function generateMetadata({ params }: ArticlePageParams): Promise<Metadata> {
  const { id, locale } = params;
  
  try {
    // 獲取文章詳情
    const response = await axios.get(`${API_BASE_URL}/articles/${id}?locale=${locale}`);
    const article = response.data.article as Article;
    
    // 如果未找到文章，返回默認元數據
    if (!article) {
      return {
        title: '文章未找到 | SJ Sphere News',
        description: '抱歉，我們無法找到您請求的文章。',
      };
    }
    
    // 構建完整的元數據
    return {
      title: article.title,
      description: article.excerpt || article.title,
      keywords: article.tags,
      authors: [{ name: article.author || 'SJ Sphere News' }],
      openGraph: {
        type: 'article',
        url: `https://news.sj-sphere.com/${locale}/news/${id}`,
        title: article.title,
        description: article.excerpt || article.title,
        images: [
          {
            url: article.image || 'https://news.sj-sphere.com/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        publishedTime: article.date,
        section: article.category,
        tags: article.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt || article.title,
        images: [article.image || 'https://news.sj-sphere.com/images/twitter-default.jpg'],
      },
    };
  } catch (error) {
    console.error('Error fetching article metadata:', error);
    return {
      title: '文章載入錯誤 | SJ Sphere News',
      description: '載入文章時發生錯誤，請稍後再試。',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageParams) {
  const { id, locale } = params;
  
  // 此元件將在客戶端呈現，動態載入內容
  return (
    <div>
      <ClientArticle id={id} locale={locale} />
    </div>
  );
}

// 處理訊息配置
export async function getRequestConfig({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  return {
    messages: (await import(`../../../../../messages/${locale}/messages.json`)).default,
  };
}

// 客戶端文章組件，用於顯示文章內容
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { zhTW, enUS, th, vi, id, ko, ja } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

// 定義 Article 類型
interface ClientArticleProps {
  id: string;
  locale: string;
}

function ClientArticle({ id, locale }: ClientArticleProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 獲取翻譯函數
  const t = useTranslations('Common');
  
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/articles/${id}?locale=${locale}`);
        if (response.data?.article) {
          setArticle(response.data.article);
        } else {
          setError('文章不存在或已被刪除');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('載入文章時發生錯誤，請稍後再試');
        
        // 創建一個測試用的假文章數據用於開發模式
        if (!IS_PRODUCTION) {
          setArticle(generateDummyArticle(id));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, locale]);
  
  // 生成測試用的假文章
  const generateDummyArticle = (id: string): Article => {
    return {
      id: parseInt(id),
      title: `這是測試文章 #${id}`,
      content: `<p>這是一篇測試文章的內容。此內容僅用於開發測試。</p>
                <p>在真實環境中，這裡會顯示從後端 API 獲取的實際文章內容。</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies ultricies, nunc nunc ultricies nunc, eget ultricies nisl nunc eget nisl.</p>
                <h2>次標題</h2>
                <p>更多測試內容。這段文字是為了模擬真實文章的段落。</p>
                <ul>
                  <li>測試項目 1</li>
                  <li>測試項目 2</li>
                  <li>測試項目 3</li>
                </ul>
                <p>結論段落。感謝您閱讀此測試文章。</p>`,
      excerpt: '這是一篇測試文章，用於開發和測試文章詳情頁面。',
      image: 'featured-1.jpg',
      category: '科技',
      author: '測試作者',
      date: new Date().toISOString(),
      tags: ['測試', '開發', '示例'],
      url: `/news/${id}`,
      relatedArticles: [
        {
          id: 101,
          title: '相關文章 1',
          excerpt: '這是相關文章 1 的摘要。',
          image: 'tech-1.jpg',
          category: '科技',
          author: '作者 A',
          date: new Date().toISOString(),
          tags: ['科技', 'AI'],
          url: '/news/101',
          content: ''
        },
        {
          id: 102,
          title: '相關文章 2',
          excerpt: '這是相關文章 2 的摘要。',
          image: 'business-1.jpg',
          category: '財經',
          author: '作者 B',
          date: new Date().toISOString(),
          tags: ['財經', '市場'],
          url: '/news/102',
          content: ''
        }
      ]
    };
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      const dateObj = parseISO(dateString);
      if (isNaN(dateObj.getTime())) return '';
      
      return format(dateObj, 'PPP', { locale: getLocale(locale) });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
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
  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-md">
          <FontAwesomeIcon icon="circle-exclamation" className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">{error || '文章載入錯誤'}</h2>
          <p className="mt-2 text-gray-600">請稍後重試或回到首頁瀏覽其他內容。</p>
          <Link href={`/${locale}`} className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            回到首頁
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 文章標題和元信息 */}
      <header className="mb-10">
        <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-white bg-red-600 rounded-full">
          {article.category}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center text-gray-600 mb-6">
          <span className="mr-4 flex items-center">
            <FontAwesomeIcon icon="user" className="mr-2 h-5 w-5 text-gray-500" />
            {article.author || 'SJ Sphere News'}
          </span>
          <span className="mr-4 flex items-center">
            <FontAwesomeIcon icon="calendar-days" className="mr-2 h-5 w-5 text-gray-500" />
            {formatDate(article.date)}
          </span>
        </div>
      </header>

      {/* 主要內容區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 文章內容 */}
        <article className="lg:col-span-2">
          {/* 文章特色圖片 */}
          <div className="relative w-full h-80 md:h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={getImageUrl(article.image)}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
          </div>
          
          {/* 文章內容 */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* 文章標籤 */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold mb-4">標籤：</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/${locale}/tag/${encodeURIComponent(tag)}`}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
                  >
                    <span className="text-blue-500 mr-1">#</span>{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* 分享按鈕 */}
          <div className="mt-8 flex items-center">
            <span className="mr-4 font-semibold flex items-center">
              <FontAwesomeIcon icon="share-nodes" className="mr-2 h-5 w-5 text-gray-700" />
              分享：
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="分享到 Facebook"
              >
                <FontAwesomeIcon icon={["fab", "facebook-f"]} className="h-5 w-5" />
              </button>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                aria-label="分享到 Twitter"
              >
                <FontAwesomeIcon icon={["fab", "x-twitter"]} className="h-5 w-5" />
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`, '_blank')}
                className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                aria-label="分享到 LinkedIn"
              >
                <FontAwesomeIcon icon={["fab", "linkedin-in"]} className="h-5 w-5" />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('連結已複製！');
                }}
                className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                aria-label="複製連結"
              >
                <FontAwesomeIcon icon="copy" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </article>
        
        {/* 側邊欄 */}
        <aside className="lg:col-span-1">
          {/* 作者資訊卡片 */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4">關於作者</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4">
                <Image
                  src="/placeholder.jpg" // 這裡應該用作者頭像
                  alt={article.author || 'SJ Sphere News'}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{article.author || 'SJ Sphere News'}</h4>
                <p className="text-gray-600 text-sm">資深記者</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">專注於{article.category}領域的報導，擁有多年新聞從業經驗。</p>
          </div>
          
          {/* 相關文章 */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">相關文章</h3>
              <div className="space-y-4">
                {article.relatedArticles.map(relatedArticle => (
                  <div key={relatedArticle.id} className="flex items-start">
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={getImageUrl(relatedArticle.image)}
                        alt={relatedArticle.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/${locale}/news/${relatedArticle.id}`}>
                          {relatedArticle.title}
                        </Link>
                      </h4>
                      <time className="text-xs text-gray-500" dateTime={relatedArticle.date}>
                        {formatDate(relatedArticle.date)}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 訂閱區域 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-2">訂閱電子報</h3>
            <p className="text-blue-100 mb-4">獲取最新的{article.category}資訊直達您的信箱</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="w-full px-4 py-2 rounded bg-white text-gray-800 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white text-blue-700 font-medium rounded hover:bg-gray-100 transition-colors"
              >
                {t('subscribe')}
              </button>
            </form>
            <p className="mt-3 text-xs text-blue-200">{t('privacyNotice')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}