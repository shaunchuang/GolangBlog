import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faTag, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';



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
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/articles/${id}`} className="text-decoration-none text-dark">
            {title}
          </Link>
        </h3>
        <p className="card-text">{excerpt}</p>
        <div className="d-flex justify-content-between text-muted small">
          <div>
            <span className="me-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {date}
            </span>
            <span className="me-3">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              {author}
            </span>
          </div>
          <div>
            <span className="me-3">
              <FontAwesomeIcon icon={faEye} className="me-1" />
              {views} 次瀏覽
            </span>
            <span>
              <FontAwesomeIcon icon={faTag} className="me-1" />
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
    <div className="card bg-dark text-white border-0 rounded-3 overflow-hidden h-100">
      <div className="bg-image" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://source.unsplash.com/random/800x400?${article.tags[0].toLowerCase()})`,
        height: '300px',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      </div>
      <div className="card-img-overlay d-flex flex-column justify-content-end">
        <h2 className="card-title mb-2">
          <Link to={`/articles/${article.id}`} className="text-white text-decoration-none">
            {article.title}
          </Link>
        </h2>
        <p className="card-text mb-3">{article.excerpt}</p>
        <div className="d-flex justify-content-between text-light small">
          <div>
            <span className="me-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
              {article.date}
            </span>
            <span className="me-3">
              <FontAwesomeIcon icon={faUser} className="me-1" />
              {article.author}
            </span>
          </div>
          <div>
            <span>
              <FontAwesomeIcon icon={faTag} className="me-1" />
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

  // 初始化Bootstrap的Carousel
  useEffect(() => {
    // 確保在組件渲染後初始化carousel
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // 動態導入Bootstrap的JavaScript
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
        // Bootstrap will be automatically initialized
      }).catch(e => console.error('Failed to load Bootstrap:', e));
    }
  }, []);
  
  return (
    <>
      <section className="mb-5">
        <div className="row mb-3">
          <div className="col">
            <h2 className="border-bottom pb-2">精選文章</h2>
          </div>
        </div>
        
        <div id="featuredArticlesCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#featuredArticlesCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          
          <div className="carousel-inner rounded-3 shadow">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <FeaturedArticleSlide article={article} />
              </div>
            ))}
          </div>
          
          <button className="carousel-control-prev" type="button" data-bs-target="#featuredArticlesCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#featuredArticlesCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
      
      <section>
        <div className="row mb-3">
          <div className="col">
            <h2 className="border-bottom pb-2">最新文章</h2>
          </div>
        </div>
        <div className="row">
          {recentArticles.map(article => (
            <div key={article.id} className="col-12">
              <ArticleCard {...article} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;