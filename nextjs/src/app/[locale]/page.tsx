'use client';

import Navbar from './components/Navbar';
import NewsCarousel from './components/NewsCarousel';
import NewsCard from './components/NewsCard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService } from '../../lib/apiService';
import { API_PATHS, IMAGE_BASE_URL } from '../../lib/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faClock, faArrowRight, faTags, faEnvelope, faArrowUp, faLandmark, faChartLine, faLaptopCode } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
const popularTags = [
  '選舉','氣候變化','疫情','經濟','教育','科技創新',
  '半導體','人工智能','電動車','可再生能源','數位轉型','醫療健康'
];

interface Article { id: number; title: string; excerpt: string; image: string; category: string; date: string; url: string; }

export default function HomePage() {
  const params = useParams();
  const locale = String(params.locale || 'en');
  
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [categoryNews, setCategoryNews] = useState<Record<string, Article[]>>({ politics: [], business: [], technology: [] });
  
  // 確保使用有效的 locale 參數
  let t;
  try {
    t = useTranslations('Common');
  } catch (error) {
    console.error('Translation error:', error);
    // 使用一個基本的翻譯備用方案
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'loading': 'Loading...',
        'emailPlaceholder': 'Your email address',
        'subscribe': 'Subscribe',
        'privacyNotice': 'We respect your privacy. You can unsubscribe at any time.'
      };
      return fallbacks[key] || key;
    };
  }

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const featuredRes = await apiService.get<{ articles: Article[] }>(API_PATHS.articles.featured);
        if (featuredRes?.articles) setFeaturedNews(featuredRes.articles);
        const latestRes = await apiService.get<{ articles: Article[] }>(API_PATHS.articles.latest);
        if (latestRes?.articles) setLatestNews(latestRes.articles);
        const [polRes, busRes, techRes] = await Promise.all([
          apiService.get<{ articles: Article[] }>(API_PATHS.articles.byCategory('politics', 2)),
          apiService.get<{ articles: Article[] }>(API_PATHS.articles.byCategory('business', 2)),
          apiService.get<{ articles: Article[] }>(API_PATHS.articles.byCategory('technology', 2)),
        ]);
        setCategoryNews({ politics: polRes?.articles || [], business: busRes?.articles || [], technology: techRes?.articles || [] });
      } catch {
        setFeaturedNews(generateFeaturedNewsData());
        setLatestNews(generateLatestNewsData());
        setCategoryNews({ politics: generatePoliticsNewsData(), business: generateBusinessNewsData(), technology: generateTechnologyNewsData() });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateFeaturedNewsData = (): Article[] => [
    { id:1, title:'全球經濟復甦進程加速，各國積極推動政策改革', excerpt:'隨著疫情...', image:getAvailableImage(0), category:'財經', date:'2023-06-10T08:30:00Z', url:'/news/1' },
    { id:2, title:'台積電宣布新一代3奈米製程技術成功量產', excerpt:'台積電今日宣布全新3奈米製程技術已經成功量產，預計將進一步鞏固在半導體產業的領導地位。', image:getAvailableImage(1), category:'科技', date:'2023-06-11T09:00:00Z', url:'/news/2' },
    { id:3, title:'亞運會開幕，台灣代表團盛裝出席', excerpt:'第19屆亞洲運動會今日盛大開幕，台灣代表團穿著特別設計的制服亮相，展現獨特風采。', image:getAvailableImage(2), category:'體育', date:'2023-06-12T10:00:00Z', url:'/news/3' },
    { id:4, title:'國際油價上漲，各國經濟受影響', excerpt:'受全球供應鏈問題影響，國際油價持續上漲，各國經濟發展面臨新的挑戰。', image:getAvailableImage(3), category:'財經', date:'2023-06-13T11:00:00Z', url:'/news/4' },
    { id:5, title:'新冠疫苗研究突破，有望應對更多變種病毒', excerpt:'科學家宣布新冠疫苗研究取得重大突破，新開發的疫苗有望對抗更多變種病毒株。', image:getAvailableImage(4), category:'健康', date:'2023-06-14T12:00:00Z', url:'/news/5' },
  ];
  const generateLatestNewsData = (): Article[] => [
    { id:1, title:'新研究顯示氣候變化速度超過預期，全球需加速減碳', excerpt:'最新科學研究表明，全球暖化速度已超過先前預測，急需加速減碳計劃...', image:'climate-1.jpg', category:'環境', date:'2023-06-12T14:30:00Z', url:'/news/1' },
    { id:2, title:'科技巨頭發布最新財報，雲端業務成長驚人', excerpt:'某科技巨頭今日公布最新季度財報，雲端業務營收年增率高達50%，遠超市場預期。', image:'tech-1.jpg', category:'科技', date:'2023-06-11T10:00:00Z', url:'/news/2' },
    { id:3, title:'新冠疫苗接種率攀升，專家呼籲勿放鬆警惕', excerpt:'儘管新冠疫苗接種率已達到70%，但專家仍警告疫情尚未結束，民眾需持續遵守防疫措施。', image:'health-1.jpg', category:'健康', date:'2023-06-10T16:20:00Z', url:'/news/3' },
  ];
  const generatePoliticsNewsData = (): Article[] => [
    { id:10, title:'國際峰會將於下月舉行，多國領導人確認出席', excerpt:'年度國際峰會將在下個月於新加坡舉行，多國領導人已確認將親自出席...', image:'politics-1.jpg', category:'政治', date:'2023-06-15T09:45:00Z', url:'/news/10' },
    { id:11, title:'新任總統上任百日，施政滿意度調查出爐', excerpt:'根據最新民調，新任總統上任百日的施政滿意度為65%，較前任提升10%。', image:'politics-1.jpg', category:'政治', date:'2023-06-14T08:30:00Z', url:'/news/11' },
  ];
  const generateBusinessNewsData = (): Article[] => [
    { id:12, title:'央行維持利率不變，經濟成長預期向上修正', excerpt:'央行今日決議維持基準利率不變，同時將今年經濟成長預測從3.2%上調至3.6%。', image:'business-1.jpg', category:'財經', date:'2023-06-13T11:00:00Z', url:'/news/12' },
    { id:13, title:'新創公司獲風投注資，計劃擴大國際市場', excerpt:'一家新創公司近日宣布完成A輪融資，將利用這筆資金擴展至國際市場。', image:'business-1.jpg', category:'財經', date:'2023-06-12T15:15:00Z', url:'/news/13' },
  ];
  const generateTechnologyNewsData = (): Article[] => [
    { id:14, title:'全新電動車品牌登台，搭載自動駕駛技術', excerpt:'一家國際電動車品牌今日宣布正式進入台灣市場，其旗艦車款配備最新自動駕駛技術，引發業界關注。', image:'tech-1.jpg', category:'科技', date:'2023-06-11T13:00:00Z', url:'/news/14' },
    { id:15, title:'本土晶片公司獲國際大廠訂單，股價飆漲', excerpt:'一家本土半導體公司今日宣布獲得國際大廠大規模訂單，消息公布後股價上漲超過9%。', image:'tech-1.jpg', category:'科技', date:'2023-06-10T09:00:00Z', url:'/news/15' },
  ];

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{t('loading')}</p></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        {/* Featured News 輪播展示 */}
        <section>
          <h2 className="section-title flex items-center">
            <FontAwesomeIcon icon={faNewspaper} className="mr-2 text-blue-600 h-6 w-6" />
            <span>頭條新聞</span>
          </h2>
          <NewsCarousel customNews={featuredNews} />
        </section>

        {/* Latest News */}
        <section>
          <h2 className="section-title flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600 h-6 w-6" />
            <span>最新新聞</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map(article => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </section>

        {/* 各類別新聞 */}
        {(Object.entries(categoryNews)).map(([categoryKey, articles]) => (
          <section key={categoryKey}>
            <h2 className="section-title flex items-center">
              <FontAwesomeIcon
                icon={
                  categoryKey === 'politics' ? faLandmark : 
                  categoryKey === 'business' ? faChartLine : 
                  faLaptopCode
                }
                className="mr-2 text-blue-600 h-6 w-6"
              />
              <span className="capitalize">{categoryKey}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href={`/category/${categoryKey}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>查看更多{categoryKey === 'politics' ? '政治' : 
                          categoryKey === 'business' ? '財經' : '科技'}新聞</span>
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        ))}

        {/* 熱門標籤 */}
        <section>
          <h2 className="section-title flex items-center">
            <FontAwesomeIcon icon={faTags} className="mr-2 text-blue-600 h-6 w-6" />
            <span>熱門標籤</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag, index) => (
              <Link key={index} href={`/tag/${encodeURIComponent(tag)}`} className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-700 rounded-full transition-colors">
                <span className="text-blue-500 mr-1">#</span>{tag}
              </Link>
            ))}
          </div>
        </section>

        {/* 訂閱電子報 */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-xl text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-3 h-6 w-6" />
                訂閱我們的電子報
              </h2>
              <p className="text-blue-100 mb-4">每日接收最新資訊，讓您隨時了解全球動態。我們將每天精選最重要的新聞發送到您的信箱。</p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="您的電子郵件地址" 
                  className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-gray-800" 
                />
                <button 
                  type="submit" 
                  className="whitespace-nowrap bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors"
                >
                  立即訂閱
                </button>
              </form>
              <p className="mt-3 text-sm text-blue-200">我們尊重您的隱私，您可以隨時取消訂閱。</p>
            </div>
          </div>
        </section>

        {/* 返回頂部按鈕 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="回到頂部"
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowUp} className="h-6 w-6" />
          </button>
        )}
      </main>
    </>
  );
}