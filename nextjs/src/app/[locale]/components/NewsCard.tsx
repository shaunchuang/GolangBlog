'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { zhTW, enUS, th, vi, id, ko, ja } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

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

interface NewsCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  url: string;
}

export default function NewsCard({
  id,
  title,
  excerpt,
  image,
  category,
  date,
  url
}: NewsCardProps) {
  // 獲取當前頁面路由參數
  const params = useParams();
  const locale = String(params.locale || 'en');
  
  // 獲取翻譯函數
  const t = useTranslations('Common');
  
  // 日期格式化邏輯
  const formattedDate = (() => {
    try {
      if (!date) return '';
      const dateObj = parseISO(date);
      if (isNaN(dateObj.getTime())) return '';
      
      return format(dateObj, 'PPP', { locale: getLocale(locale) });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  })();
  
  return (
    <div className="news-card relative flex flex-col overflow-hidden bg-white rounded-xl shadow-md h-full">
      {/* 文章圖片 */}
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg'; // 圖片載入失敗時使用佔位圖
          }}
        />
        {/* 分類標籤 */}
        <div className="absolute top-3 left-3">
          <span className="category-badge bg-red-600 text-white">
            {category}
          </span>
        </div>
      </div>
      
      {/* 文章內容 */}
      <div className="p-4 flex flex-col flex-grow">
        <time className="text-sm text-gray-500 mb-2" dateTime={date}>
          {formattedDate}
        </time>
        <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link href={url} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {excerpt}
        </p>
        <div className="mt-auto">
          <Link href={url} 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            {t('readMore')}
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}