'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 環境判斷常數
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IMAGE_BASE_URL = IS_PRODUCTION 
  ? 'https://news.sj-sphere.com/images/news' 
  : '/images/news';

// 根據環境處理圖片路徑
const getImageUrl = (imagePath: string) => {
  // 若已經是絕對路徑且不是指向主域名
  if (imagePath && imagePath.startsWith('http') && !imagePath.includes('news.sj-sphere.com')) {
    return imagePath;
  }
  
  if (!imagePath) return '/placeholder.jpg';
  
  // 提取圖片檔名
  const imageName = imagePath.split('/').pop() || '';
  return `${IMAGE_BASE_URL}/${imageName}`;
};

// 可用的圖片列表，這些圖片確實存在於服務器上
const availableImages = [
  'featured-1.jpg',  // 只有這一張 featured 圖片存在
  'business-1.jpg',
  'climate-1.jpg',
  'health-1.jpg',
  'politics-1.jpg',
  'sports-1.jpg',
  'tech-1.jpg'
];

// 獲取可用圖片的函數，根據索引循環使用可用圖片
const getAvailableImage = (index: number) => {
  return availableImages[index % availableImages.length];
};

// 模擬頭條新聞資料，修改使用實際存在的圖片
const dummyFeaturedNews = [
  {
    id: 1,
    title: '全球經濟復甦進程加速，各國積極推動政策改革',
    excerpt: '隨著疫情影響逐漸減弱，全球經濟正迎來全面復甦...',
    image: getAvailableImage(0),  // featured-1.jpg
    category: '財經',
    date: '2023-06-10T08:30:00Z',
    url: '/news/1',
  },
  {
    id: 2,
    title: '台積電宣布新一代3奈米製程技術成功量產',
    excerpt: '台積電今日宣布全新3奈米製程技術已經成功量產，預計將進一步鞏固在半導體產業的領導地位。',
    image: getAvailableImage(1),  // business-1.jpg
    category: '科技',
    date: '2023-06-11T09:00:00Z',
    url: '/news/2',
  },
  {
    id: 3,
    title: '亞運會開幕，台灣代表團盛裝出席',
    excerpt: '第19屆亞洲運動會今日盛大開幕，台灣代表團穿著特別設計的制服亮相，展現獨特風采。',
    image: getAvailableImage(2),  // climate-1.jpg
    category: '體育',
    date: '2023-06-12T10:00:00Z',
    url: '/news/3',
  },
  {
    id: 4,
    title: '國際油價上漲，各國經濟受影響',
    excerpt: '受全球供應鏈問題影響，國際油價持續上漲，各國經濟發展面臨新的挑戰。',
    image: getAvailableImage(3),  // health-1.jpg
    category: '財經',
    date: '2023-06-13T11:00:00Z',
    url: '/news/4',
  },
  {
    id: 5,
    title: '新冠疫苗研究突破，有望應對更多變種病毒',
    excerpt: '科學家宣布新冠疫苗研究取得重大突破，新開發的疫苗有望對抗更多變種病毒株。',
    image: getAvailableImage(4),  // politics-1.jpg
    category: '健康',
    date: '2023-06-14T12:00:00Z',
    url: '/news/5',
  },
];

// 定義文章類型
interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  url: string;
}

interface NewsCarouselProps {
  customNews?: Article[];
}

export default function NewsCarousel({ customNews }: NewsCarouselProps) {
  // 使用傳入的自定義新聞或默認新聞
  const newsItems = customNews && customNews.length > 0 ? customNews : dummyFeaturedNews;
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState<Record<number, boolean>>({});
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // 自動輪播
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % newsItems.length);
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, newsItems.length]);

  // 暫停/繼續自動輪播
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // 切換到指定輪播幻燈片
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 前往下一個或上一個幻燈片
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  // 處理圖片載入事件
  const handleImageLoad = (index: number) => {
    setIsImageLoaded(prev => ({...prev, [index]: true}));
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-lg aspect-video"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        {newsItems.map((news, index) => (
          <div
            key={news.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full h-full">
              {/* 載入中的佔位元素 */}
              <div className={`absolute inset-0 bg-gray-200 animate-pulse ${isImageLoaded[index] ? 'hidden' : 'block'}`}></div>
              
              <Image
                src={getImageUrl(news.image)}
                alt={news.title}
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, 100vw"
                className="object-cover w-full h-full transition-all duration-700"
                priority={index === 0 || index === 1}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                  handleImageLoad(index);
                }}
                onLoad={() => handleImageLoad(index)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <div className="inline-block px-2 py-1 mb-2 text-xs font-semibold uppercase bg-red-600 rounded">
                  {news.category}
                </div>
                <h2 className="mb-2 text-xl md:text-3xl font-bold">{news.title}</h2>
                <p className="mb-4 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                  {news.excerpt}
                </p>
                <Link
                  href={news.url}
                  className="inline-block px-4 py-2 text-sm font-semibold bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 左右導航按鈕 */}
      <button
        onClick={prevSlide}
        className="absolute left-0 z-20 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 m-2 rounded-full focus:outline-none"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 z-20 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 m-2 rounded-full focus:outline-none"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 輪播指示器 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}