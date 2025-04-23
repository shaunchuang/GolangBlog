import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faTag, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, title, excerpt, date, author, tags, views }: {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  views: number;
}) => {
  return (
    <div className="card h-full">
      <div className="card-body">
        <h3 className="text-xl font-bold mb-2">
          <Link to={`/articles/${id}`} className="text-gray-900 dark:text-gray-100 no-underline hover:text-blue-600 dark:hover:text-blue-400">
            {title}
          </Link>
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex flex-wrap justify-between text-gray-600 dark:text-gray-400 text-sm">
          <div className="mb-2 md:mb-0">
            <span className="mr-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
              {date}
            </span>
            <span className="mr-3">
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              {author}
            </span>
          </div>
          <div>
            <span className="mr-3">
              <FontAwesomeIcon icon={faEye} className="mr-1" />
              {views} 次瀏覽
            </span>
            <span>
              <FontAwesomeIcon icon={faTag} className="mr-1" />
              {tags.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedArticleSlide = ({ article }: { article: any }) => {
  return (
    <div className="relative rounded-lg overflow-hidden h-full bg-gray-900 text-white border-0">
      <div className="absolute inset-0" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://source.unsplash.com/random/800x400?${article.tags[0].toLowerCase()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%'
      }}>
      </div>
      <div className="relative flex flex-col justify-end p-6 h-full">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          <Link to={`/articles/${article.id}`} className="text-white no-underline hover:text-gray-200">
            {article.title}
          </Link>
        </h2>
        <p className="mb-3 hidden md:block">{article.excerpt}</p>
        <p className="mb-3 block md:hidden">
          {article.excerpt.length > 60 ? article.excerpt.substring(0, 60) + '...' : article.excerpt}
        </p>
        <div className="flex flex-wrap justify-between text-gray-300 text-sm">
          <div className="mb-1 md:mb-0">
            <span className="mr-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
              {article.date}
            </span>
            <span className="mr-3 hidden sm:inline-block">
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              {article.author}
            </span>
          </div>
          <div>
            <span>
              <FontAwesomeIcon icon={faTag} className="mr-1" />
              {article.tags.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  // 模擬文章資料
  const featuredArticles = [
    {
      id: 1,
      title: "Golang 最佳實踐指南",
      excerpt: "此文章介紹了 Go 語言的最佳實踐和常見的程式設計模式，幫助開發者寫出高效能、可維護的程式碼。",
      date: "2025-04-01",
      author: "Shaun",
      tags: ["Golang", "最佳實踐"],
      views: 1250
    },
    {
      id: 2,
      title: "使用 React 搭配 TypeScript 的優勢",
      excerpt: "本文深入探討了在 React 專案中使用 TypeScript 的好處，以及如何正確設置以獲得最佳開發體驗。",
      date: "2025-03-25",
      author: "Shaun",
      tags: ["React", "TypeScript"],
      views: 980
    }
  ];
  
  const recentArticles = [
    {
      id: 3,
      title: "如何使用 Bootstrap 美化你的網站",
      excerpt: "這篇文章詳細說明了如何利用 Bootstrap 框架來快速美化你的網站，提供了多種實用的技巧。",
      date: "2025-04-03",
      author: "Shaun",
      tags: ["Bootstrap", "前端開發"],
      views: 675
    },
    {
      id: 4,
      title: "Go 語言並發處理實戰",
      excerpt: "探討 Go 語言中的 goroutines 和 channels，以及如何在實際項目中有效地使用它們處理並發問題。",
      date: "2025-03-30",
      author: "Shaun",
      tags: ["Golang", "並發"],
      views: 820
    },
    {
      id: 5,
      title: "前端開發中的 i18n 國際化",
      excerpt: "本文介紹了如何在前端專案中實現國際化，使你的網站能夠支援多種語言。",
      date: "2025-03-28",
      author: "Shaun",
      tags: ["i18n", "前端開發"],
      views: 542
    }
  ];
  
  return (
    <>
      <section className="mb-10">
        <div className="mb-6 border-b border-gray-200 pb-2">
          <h2 className="text-2xl font-bold">精選文章</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left-side carousel */}
          <div className="lg:col-span-7">
            <div id="featuredArticlesCarousel" className="relative">
              <div className="hidden">
                {/* 由於移除了Bootstrap，我們不再需要輪播指標 */}
                {/* 後續可使用React套件如react-slick或建立自定義輪播 */}
              </div>
              
              <div className="rounded-lg shadow-md overflow-hidden">
                {/* 只顯示第一個文章，移除輪播功能，後續可使用React輪播套件 */}
                <FeaturedArticleSlide article={featuredArticles[0]} />
              </div>
            </div>
          </div>

          {/* Right-side article list */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-700">
              {featuredArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <h5 className="text-lg font-semibold mb-1">{article.title}</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{article.excerpt}</p>
                  <small className="text-gray-500 dark:text-gray-500">
                    {article.date} - {article.author}
                  </small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <div className="mb-6 border-b border-gray-200 pb-2">
          <h2 className="text-2xl font-bold">最新文章</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map(article => (
            <div key={article.id}>
              <ArticleCard {...article} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;