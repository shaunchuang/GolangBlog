'use client';

import Navbar from './components/Navbar';
import NewsCarousel from './components/NewsCarousel';
import NewsCard from './components/NewsCard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService } from '../../lib/apiService';
import { API_PATHS, IMAGE_BASE_URL } from '../../lib/apiConfig';

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
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [categoryNews, setCategoryNews] = useState<Record<string, Article[]>>({ politics: [], business: [], technology: [] });

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
      <p className="mt-4 text-gray-600">正在載入最新新聞...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      <Navbar />
      <div className="h-16"></div>
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <section className="mb-10">
          <h2 className="section-title flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </span>
            Featured News
          </h2>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <NewsCarousel customNews={featuredNews} />
          </div>
        </section>
        <section className="mb-12">
          <h2 className="section-title flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <div key={news.id} className="transform transition-all duration-500" style={{ 
                transitionDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 150}ms both`
              }}>
                <NewsCard
                  id={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={getImageUrl(news.image)}
                  category={news.category}
                  date={news.date}
                  url={news.url}
                />
              </div>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <section className="lg:col-span-1">
            <h2 className="section-title flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Politics
            </h2>
            <div className="space-y-4">
              {categoryNews.politics.map(news => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={getImageUrl(news.image)}
                  category={news.category}
                  date={news.date}
                  url={news.url}
                />
              ))}
            </div>
          </section>
          <section className="lg:col-span-1">
            <h2 className="section-title flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Business
            </h2>
            <div className="space-y-4">
              {categoryNews.business.map(news => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={getImageUrl(news.image)}
                  category={news.category}
                  date={news.date}
                  url={news.url}
                />
              ))}
            </div>
          </section>
          <section className="lg:col-span-1">
            <h2 className="section-title flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Technology
            </h2>
            <div className="space-y-4">
              {categoryNews.technology.map(news => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={getImageUrl(news.image)}
                  category={news.category}
                  date={news.date}
                  url={news.url}
                />
              ))}
            </div>
          </section>
        </div>
        <section className="mb-12 bg-white p-6 rounded-xl shadow-md">
          <h2 className="section-title flex items-center mb-6">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map(tag => (
              <a
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center"
              >
                <span className="text-blue-500 mr-1">#</span>{tag}
              </a>
            ))}
          </div>
        </section>
        <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:w-2/3 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Our Newsletter</h2>
              <p className="mb-6 text-blue-100">訂閱我們的電子報，獲取最新新聞和獨家內容直達您的信箱。</p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-lg">
                <input
                  type="email"
                  placeholder="您的電子郵件"
                  className="px-4 py-3 w-full text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors whitespace-nowrap"
                >
                  立即訂閱
                </button>
              </form>
              <p className="mt-3 text-xs text-blue-200">我們尊重您的隱私，不會分享您的信息。</p>
            </div>
            <div className="hidden md:block md:w-1/3">
              <svg className="w-full h-full text-white opacity-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">SJ Sphere News</h3>
              <p className="text-gray-400">提供全球最即時的新聞資訊，涵蓋政治、財經、科技、娛樂、體育、健康等各領域。</p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">主要分類</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/category/politics" className="hover:text-white transition-colors">政治</a></li>
                <li><a href="/category/business" className="hover:text-white transition-colors">財經</a></li>
                <li><a href="/category/technology" className="hover:text-white transition-colors">科技</a></li>
                <li><a href="/category/entertainment" className="hover:text-white transition-colors">娛樂</a></li>
                <li><a href="/category/sports" className="hover:text-white transition-colors">體育</a></li>
                <li><a href="/category/health" className="hover:text-white transition-colors">健康</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">快速連結</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">關於我們</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">聯絡我們</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">隱私政策</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">使用條款</a></li>
                <li><a href="/advertise" className="hover:text-white transition-colors">廣告合作</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">徵才資訊</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">選擇語言</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-400">
                <a href="/en" className="hover:text-white transition-colors">English</a>
                <a href="/th" className="hover:text-white transition-colors">ไทย</a>
                <a href="/vi" className="hover:text-white transition-colors">Tiếng Việt</a>
                <a href="/id" className="hover:text-white transition-colors">Bahasa</a>
                <a href="/ko" className="hover:text-white transition-colors">한국어</a>
                <a href="/ja" className="hover:text-white transition-colors">日本語</a>
                <a href="/zh-tw" className="hover:text-white transition-colors">繁體中文</a>
                <a href="/zh-cn" className="hover:text-white transition-colors">简体中文</a>
                <a href="/zh-my" className="hover:text-white transition-colors">马来西亚中文</a>
                <a href="/zh-sg" className="hover:text-white transition-colors">新加坡中文</a>
                <a href="/zh-mo" className="hover:text-white transition-colors">澳門中文</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="mb-4">&copy; {currentYear} SJ Sphere News. All rights reserved.</p>
            <p className="text-xs">本網站內容受到著作權法保護。未經授權，不得轉載或複製。</p>
          </div>
        </div>
      </footer>
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg z-50 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-10'
        }`}
        aria-label="回到頂部"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 640px) {
          .section-title {
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}