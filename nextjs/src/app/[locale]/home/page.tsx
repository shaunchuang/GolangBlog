'use client';

import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '../../../lib/apiService';
import { API_PATHS, IMAGE_BASE_URL, API_BASE_URL } from '../../../lib/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faArrowRight, 
  faTags, 
  faEnvelope, 
  faArrowUp, 
  faLandmark
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faXTwitter 
} from '@fortawesome/free-brands-svg-icons';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

// 處理圖片路徑
const getImageUrl = (imagePath: string) => {
  if (imagePath && imagePath.startsWith('http') && !imagePath.includes('news.sj-sphere.com')) {
    return imagePath;
  }
  if (!imagePath) return '/placeholder.jpg';
  const fileName = imagePath.replace(/^\/images\/news\//, '').split('/').pop() || '';
  return `${IMAGE_BASE_URL}/${fileName}`;
};

const availableImages = [
  'business-1.jpg','climate-1.jpg','featured-1.jpg','health-1.jpg',
  'politics-1.jpg','sports-1.jpg','tech-1.jpg'
];
const getAvailableImage = (index: number) => availableImages[index % availableImages.length];

// 熱門標籤
const popularTags = [
  '選舉','氣候變化','疫情','經濟','教育','科技創新',
  '半導體','人工智能','電動車','可再生能源'
];

// 熱門專欄作者
const popularAuthors = [
  '陳明華 - 科技觀察家',
  '林文德 - 國際政治分析師',
  '黃雅芳 - 財經專欄作家',
  '張建國 - 環保議題專家'
];

interface Article { id: number; title: string; excerpt: string; image: string; category: string; date: string; url: string; }

export default function HomePage() {
  // 創建初始化狀態標記，用於防止 hydration 不匹配
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const locale = String(params?.locale || 'zh-TW');
  
  const [isLoading, setIsLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [inDepthStories, setInDepthStories] = useState<Article[]>([]);
  const [weeklyFeatured, setWeeklyFeatured] = useState<Article | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // 確保使用有效的 locale 參數
  let t;
  try {
    t = useTranslations('Common');
  } catch (error) {
    console.error('Translation error:', error);
    // 使用一個基本的翻譯備用方案
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'loading': '載入中...',
        'emailPlaceholder': '您的電子郵件',
        'subscribe': '訂閱',
        'privacyNotice': '我們尊重您的隱私，您可以隨時取消訂閱。'
      };
      return fallbacks[key] || key;
    };
  }

  // 在組件掛載後標記為客戶端，解決 hydration 不匹配
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 只在客戶端渲染後執行
    if (!isClient) return;
    
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        console.log('正在獲取精選文章，API 路徑:', API_PATHS.articles.featured);
        console.log('使用的 API 基礎 URL:', API_BASE_URL);
        
        const featuredRes = await apiService.get<{ articles: Article[] }>(API_PATHS.articles.featured);
        console.log('獲取精選文章響應:', featuredRes);
        if (featuredRes?.articles) {
          console.log('設置精選文章:', featuredRes.articles);
          setFeaturedNews(featuredRes.articles);
        } else {
          console.warn('精選文章響應中沒有 articles 屬性');
        }
        
        const latestRes = await apiService.get<{ articles: Article[] }>(API_PATHS.articles.latest);
        console.log('獲取最新文章響應:', latestRes);
        if (latestRes?.articles) {
          console.log('設置最新文章:', latestRes.articles);
          setLatestNews(latestRes.articles);
        } else {
          console.warn('最新文章響應中沒有 articles 屬性');
        }
        
        const inDepthRes = await apiService.get<{ articles: Article[] }>(API_PATHS.articles.featured);
        console.log('獲取深度報導響應:', inDepthRes);
        if (inDepthRes?.articles) {
          console.log('設置深度報導:', inDepthRes.articles);
          setInDepthStories(inDepthRes.articles);
        } else {
          console.warn('深度報導響應中沒有 articles 屬性');
        }
        
        // 設置本週精選
        if (latestRes?.articles && latestRes.articles.length > 0) {
          console.log('設置本週精選:', latestRes.articles[0]);
          setWeeklyFeatured(latestRes.articles[0]);
        } else {
          console.warn('沒有可用的最新文章設置為本週精選');
        }
      } catch (error) {
        // 顯示錯誤信息而不是默默使用模擬數據
        console.error('API 請求失敗:', error);
        console.warn('由於 API 請求失敗，將使用模擬數據');
        
        // 仍然使用模擬數據以確保頁面可用
        setFeaturedNews(generateFeaturedNewsData());
        setLatestNews(generateLatestNewsData());
        setInDepthStories(generateInDepthStoriesData());
        setWeeklyFeatured(generateWeeklyFeaturedData());
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [isClient]); // 添加 isClient 作為依賴，確保只在客戶端運行

  // 監聽捲軸事件以顯示返回頂部按鈕
  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);
  
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 模擬數據生成函數
  const generateFeaturedNewsData = (): Article[] => [
    { id:1, title:'全球經濟復甦進程加速，各國積極推動政策改革', excerpt:'隨著疫情影響逐漸減弱，全球經濟正呈現明顯復甦跡象。各國政府推出一系列政策改革，以刺激經濟增長並改善就業狀況。', image:getAvailableImage(0), category:'特刊', date:'2025-05-01T08:30:00Z', url:`/${locale}/news/1` },
    { id:2, title:'台積電宣布新一代2奈米製程技術成功量產', excerpt:'台積電今日宣布全新2奈米製程技術已經成功量產，預計將進一步鞏固在半導體產業的領導地位，為AI時代提供關鍵支持。', image:getAvailableImage(1), category:'專題報導', date:'2025-04-30T09:00:00Z', url:`/${locale}/news/2` },
    { id:3, title:'氣候變遷會議：各國承諾加速減碳，2050年實現碳中和', excerpt:'在最新一輪氣候變遷國際會議上，全球主要經濟體紛紛承諾加速減碳進程，並共同努力實現2050年碳中和目標。', image:getAvailableImage(2), category:'特刊', date:'2025-04-29T10:00:00Z', url:`/${locale}/news/3` },
  ];

  const generateLatestNewsData = (): Article[] => [
    { id:4, title:'新研究顯示睡眠質量與心血管健康直接相關', excerpt:'最新醫學研究表明，優質睡眠不僅能增強免疫系統，還能顯著降低心血管疾病風險。專家建議成年人每晚應保持7-9小時的睡眠。', image:getAvailableImage(3), category:'生活', date:'2025-05-02T14:30:00Z', url:`/${locale}/news/4` },
    { id:5, title:'人工智能在醫療診斷領域取得突破性進展', excerpt:'一款新型AI診斷系統在臨床測試中展現出超越人類專家的準確率，有望徹底革新醫療診斷流程，提早發現疾病跡象。', image:getAvailableImage(4), category:'科技', date:'2025-05-01T10:00:00Z', url:`/${locale}/news/5` },
    { id:6, title:'全球首款量子計算機晶片問世，計算能力提升百倍', excerpt:'科技巨頭宣布成功研發全球首款商用量子計算機晶片，計算特定問題的速度比傳統超級計算機快100倍。', image:getAvailableImage(5), category:'科技', date:'2025-04-29T16:20:00Z', url:`/${locale}/news/6` },
    { id:7, title:'永續時尚成主流，環保材料需求激增', excerpt:'隨著消費者環保意識提升，永續時尚產業迅速發展。使用回收材料和有機棉的品牌銷量大幅增長，傳統時尚品牌紛紛轉型。', image:getAvailableImage(6), category:'生活', date:'2025-04-28T12:15:00Z', url:`/${locale}/news/7` },
    { id:8, title:'新能源車銷量首次超越燃油車，電動革命加速到來', excerpt:'全球多個主要市場的新能源車銷量首次超越傳統燃油車，顯示能源轉型進程正在加速，消費者對綠色出行方案接受度提高。', image:getAvailableImage(0), category:'國際', date:'2025-04-27T09:45:00Z', url:`/${locale}/news/8` },
    { id:9, title:'全球糧食危機警報：氣候變遷嚴重威脅農業生產', excerpt:'聯合國發布最新報告指出，氣候變化已經對全球農業生產造成嚴重影響，若不採取緊急措施，未來十年糧食安全將面臨空前挑戰。', image:getAvailableImage(1), category:'國際', date:'2025-04-26T11:20:00Z', url:`/${locale}/news/9` },
  ];
  
  const generateInDepthStoriesData = (): Article[] => [
    { id:10, title:'深度分析：後疫情時代的全球供應鏈重構', excerpt:'疫情徹底改變了全球供應鏈結構，各國紛紛將關鍵產業回流。本文深入探討這一趨勢對全球經濟格局的深遠影響。', image:getAvailableImage(2), category:'專題', date:'2025-04-25T08:30:00Z', url:`/${locale}/news/10` },
    { id:11, title:'解密量子技術：下一代科技革命的核心驅動力', excerpt:'量子計算、量子通信、量子感測...未來20年，量子技術將如何改變我們的生活？本專題詳細解析這一前沿科技的發展現狀與未來願景。', image:getAvailableImage(3), category:'專題', date:'2025-04-20T09:45:00Z', url:`/${locale}/news/11` },
    { id:12, title:'全球能源轉型報告：綠色革命的機遇與挑戰', excerpt:'從化石燃料到可再生能源，能源結構轉型關乎人類未來。本報告從經濟、政治、環境多角度分析這場轉型的進程、阻力與未來路徑。', image:getAvailableImage(4), category:'專題', date:'2025-04-15T10:30:00Z', url:`/${locale}/news/12` },
    { id:13, title:'數位人民幣與全球貨幣體系的未來', excerpt:'中國數位人民幣試點不斷擴大，各國央行數位貨幣競相發展，這將如何重塑全球金融體系？本文提供前所未有的深度分析。', image:getAvailableImage(5), category:'專題', date:'2025-04-10T14:15:00Z', url:`/${locale}/news/13` },
  ];

  const generateWeeklyFeaturedData = (): Article => ({
    id: 14,
    title: '一帶一路十週年：全球基礎設施建設的新格局與新挑戰',
    excerpt: '一帶一路倡議實施十年來，已有超過140個國家參與其中，總投資超過一萬億美元。本專題深入剖析這一世紀工程的成就與爭議，並展望未來發展方向。',
    image: getAvailableImage(2),
    category: '本週精選',
    date: '2025-05-01T00:00:00Z',
    url: `/${locale}/news/14`
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header（頂部） */}
      <Navbar />
      
      <div className="pt-16"> {/* 導航欄固定在頂部，需要添加padding */}
        <div className="max-w-screen-xl mx-auto px-8">
          {/* Hero Area（大型封面區） */}
          {featuredNews.length > 0 && (
            <section className="my-8">
              <div className="bg-white">
                <div className="flex flex-col">
                  {/* 主要大圖文章 */}
                  <div className="relative h-[500px] w-full overflow-hidden">
                    <Image 
                      src={getImageUrl(featuredNews[0].image)}
                      alt={featuredNews[0].title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(min-width: 1280px) 1200px, 100vw"
                    />
                    {/* 半透明漸層覆蓋 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    
                    {/* 內容覆蓋 */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <span className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-medium mb-4">
                        {featuredNews[0].category}
                      </span>
                      
                      <h1 className="text-4xl font-bold mb-3 leading-tight max-w-3xl">
                        {featuredNews[0].title}
                      </h1>
                      
                      <p className="text-lg text-gray-100 mb-4 max-w-2xl leading-relaxed">
                        {featuredNews[0].excerpt}
                      </p>
                      
                      <Link 
                        href={featuredNews[0].url || `/${locale}/news/${featuredNews[0].id}`}
                        className="inline-flex items-center px-5 py-2 bg-white text-blue-700 font-medium rounded hover:bg-gray-100 transition-colors"
                      >
                        閱讀全文
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* 次要文章條目 */}
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    {featuredNews.slice(1, 3).map(article => (
                      <div key={article.id} className="flex items-start">
                        <div className="flex-shrink-0 h-24 w-24 relative mr-4">
                          <Image 
                            src={getImageUrl(article.image)}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="inline-block bg-gray-200 text-gray-700 px-2 py-0.5 text-xs font-medium mb-2">
                            {article.category}
                          </span>
                          <h3 className="font-semibold leading-tight mb-1">
                            <Link href={article.url || `/${locale}/news/${article.id}`} className="hover:text-blue-600 transition-colors">
                              {article.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(article.date).toLocaleDateString('zh-TW')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* Content Grid（主內容區塊） */}
          <div className="flex flex-row gap-8">
            {/* 左欄（主欄位） */}
            <div className="w-2/3">
              {/* 最新文章 - 卡片式 */}
              <section className="mb-12 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-100 flex items-center">
                  <FontAwesomeIcon icon={faNewspaper} className="mr-3 text-blue-600 w-5 h-5" />
                  最新文章
                </h2>
                
                <div className="grid grid-cols-2 gap-8">
                  {latestNews.slice(0, 4).map(article => (
                    <div key={article.id} className="flex flex-col">
                      <div className="relative h-40 mb-4 overflow-hidden">
                        <Image 
                          src={getImageUrl(article.image)} 
                          alt={article.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-0 left-0 m-3">
                          <span className="bg-red-600 text-white px-2 py-1 text-xs">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        <Link href={article.url || `/${locale}/news/${article.id}`} className="hover:text-blue-600 transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="text-gray-500 text-xs mt-auto">
                        {new Date(article.date).toLocaleDateString('zh-TW')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <Link 
                    href={`/${locale}/news`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    查看更多文章
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </section>
              
              {/* 深度專題 - 清單樣式 */}
              <section className="bg-white p-8">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-100 flex items-center">
                  <FontAwesomeIcon icon={faLandmark} className="mr-3 text-blue-600 w-5 h-5" />
                  深度專題
                </h2>
                
                <div className="space-y-6">
                  {inDepthStories.map(story => (
                    <article key={story.id} className="flex border-b border-gray-100 pb-6 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors p-2">
                      <div className="flex-shrink-0 mr-6">
                        <div className="h-32 w-48 relative">
                          <Image
                            src={getImageUrl(story.image)}
                            alt={story.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <Link href={story.url || `/${locale}/news/${story.id}`} className="group">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{story.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{story.excerpt}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{new Date(story.date).toLocaleDateString('zh-TW')}</span>
                            <span>{story.category}</span>
                          </div>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            
            {/* 右欄（側邊欄） */}
            <div className="w-1/3">
              {/* 本週精選 */}
              {weeklyFeatured && (
                <section className="mb-8 bg-white p-6">
                  <h2 className="text-xl font-bold mb-5 pb-2 border-b border-gray-100">
                    本週精選
                  </h2>
                  
                  <div className="mb-4 relative rounded overflow-hidden">
                    <Image 
                      src={getImageUrl(weeklyFeatured.image)} 
                      alt={weeklyFeatured.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 m-3">
                      <span className="bg-yellow-500 text-white px-2 py-1 text-xs">
                        {weeklyFeatured.category}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">
                    <Link href={weeklyFeatured.url || `/${locale}/news/${weeklyFeatured.id}`} className="hover:text-blue-600 transition-colors">
                      {weeklyFeatured.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {weeklyFeatured.excerpt}
                  </p>
                  
                  <Link 
                    href={weeklyFeatured.url || `/${locale}/news/${weeklyFeatured.id}`}
                    className="text-blue-600 text-sm hover:underline inline-flex items-center"
                  >
                    閱讀全文 
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 h-3 w-3" />
                  </Link>
                </section>
              )}
              
              {/* 熱門作者專欄 */}
              <section className="mb-8 bg-white p-6">
                <h2 className="text-xl font-bold mb-5 pb-2 border-b border-gray-100">
                  作者專欄
                </h2>
                
                <ul className="divide-y divide-gray-100">
                  {popularAuthors.map((author, index) => (
                    <li key={index} className="py-3 first:pt-0">
                      <Link href={`/${locale}/author/${encodeURIComponent(author.split(' - ')[0])}`} className="flex items-center hover:text-blue-600 transition-colors">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mr-3 font-semibold">
                          {author.charAt(0)}
                        </div>
                        <span>{author}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              
              {/* 熱門標籤 */}
              <section className="mb-8 bg-white p-6">
                <h2 className="text-xl font-bold mb-5 pb-2 border-b border-gray-100 flex items-center">
                  <FontAwesomeIcon icon={faTags} className="mr-2 text-blue-600 w-4 h-4" />
                  熱門主題
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Link 
                      key={index} 
                      href={`/${locale}/tag/${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      <span className="text-blue-500 mr-1">#</span>{tag}
                    </Link>
                  ))}
                </div>
              </section>
              
              {/* 訂閱電子報 */}
              <section className="bg-white p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600 w-5 h-5" />
                  訂閱電子報
                </h2>
                
                <p className="text-gray-600 text-sm mb-4">
                  訂閱我們的電子報，獲取最新資訊和獨家內容。
                </p>
                
                <form className="space-y-3">
                  <input 
                    type="email"
                    placeholder="您的電子郵件"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-medium"
                  >
                    立即訂閱
                  </button>
                </form>
                
                <p className="mt-3 text-xs text-gray-500">
                  我們尊重您的隱私，您可以隨時取消訂閱。
                </p>
              </section>
            </div>
          </div>
        </div>
        
        {/* Footer（頁尾） */}
        <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-12">
          <div className="max-w-screen-xl mx-auto px-8">
            <div className="grid grid-cols-4 gap-8">
              {/* Logo 區域 */}
              <div className="col-span-1">
                <Link href={`/${locale}`} className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">SJ Sphere</span>
                </Link>
                <p className="text-gray-600 text-sm">
                  提供最新國際新聞、財經、科技、體育等各類新聞資訊
                </p>
              </div>
              
              {/* 導覽連結-新聞分類 */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">新聞分類</h3>
                <ul className="space-y-2">
                  <li><Link href={`/${locale}/category/politics`} className="text-gray-600 hover:text-blue-600 transition-colors">國際</Link></li>
                  <li><Link href={`/${locale}/category/business`} className="text-gray-600 hover:text-blue-600 transition-colors">財經</Link></li>
                  <li><Link href={`/${locale}/category/technology`} className="text-gray-600 hover:text-blue-600 transition-colors">科技</Link></li>
                  <li><Link href={`/${locale}/category/lifestyle`} className="text-gray-600 hover:text-blue-600 transition-colors">生活</Link></li>
                  <li><Link href={`/${locale}/category/opinion`} className="text-gray-600 hover:text-blue-600 transition-colors">觀點</Link></li>
                </ul>
              </div>
              
              {/* 導覽連結-關於我們 */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">關於我們</h3>
                <ul className="space-y-2">
                  <li><Link href={`/${locale}/about`} className="text-gray-600 hover:text-blue-600 transition-colors">關於我們</Link></li>
                  <li><Link href={`/${locale}/contact`} className="text-gray-600 hover:text-blue-600 transition-colors">聯絡我們</Link></li>
                  <li><Link href={`/${locale}/privacy`} className="text-gray-600 hover:text-blue-600 transition-colors">隱私政策</Link></li>
                  <li><Link href={`/${locale}/terms`} className="text-gray-600 hover:text-blue-600 transition-colors">使用條款</Link></li>
                </ul>
              </div>
              
              {/* 社群連結 */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">關注我們</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                     className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                     className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-600 transition-colors">
                    <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                     className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors">
                    <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} SJ Sphere News. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Powered by Next.js + Gin
              </p>
            </div>
          </div>
        </footer>
        
        {/* 返回頂部按鈕 */}
        {isClient && showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="回到頂部"
            className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          >
            <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}