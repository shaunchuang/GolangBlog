import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tagParam = searchParams.get('tag');
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);
  const [showSidebar, setShowSidebar] = useState(false);

  const tags = [
    { id: 1, name: 'React', count: 22 },
    { id: 2, name: 'Golang', count: 18 },
    { id: 3, name: 'TypeScript', count: 15 },
    { id: 4, name: 'Docker', count: 10 },
    { id: 5, name: 'AWS', count: 8 },
    { id: 6, name: 'Database', count: 12 },
    { id: 7, name: 'Frontend', count: 20 },
    { id: 8, name: 'Backend', count: 16 }
  ];

  const articles = [
    { id: 1, title: 'React 18中的新特性與優化', tags: ['React', 'Frontend'], date: '2025-04-05' },
    { id: 2, title: 'Golang 併發模式與最佳實踐', tags: ['Golang', 'Backend'], date: '2025-04-03' },
    { id: 3, title: 'TypeScript 5.0新增功能詳解', tags: ['TypeScript', 'Frontend'], date: '2025-04-01' },
    { id: 4, title: 'Docker容器化應用實戰指南', tags: ['Docker', 'DevOps'], date: '2025-03-28' },
    { id: 5, title: 'AWS Lambda無伺服器架構設計', tags: ['AWS', 'Cloud'], date: '2025-03-25' },
    { id: 6, title: 'MongoDB與PostgreSQL比較', tags: ['Database', 'Backend'], date: '2025-03-22' },
    { id: 7, title: 'React與Vue框架對比分析', tags: ['React', 'Frontend', 'Vue'], date: '2025-03-20' },
    { id: 8, title: 'Golang微服務架構設計', tags: ['Golang', 'Microservices', 'Backend'], date: '2025-03-18' }
  ];

  // 根據熱門度排序標籤
  const popularTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 5);

  // 根據選中的標籤過濾文章
  const filteredArticles = activeTag 
    ? articles.filter(article => article.tags.includes(activeTag))
    : articles;

  useEffect(() => {
    // 更新選中的標籤
    setActiveTag(tagParam);
  }, [tagParam]);

  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h2>{t('nav.categories')}</h2>
        <h4 className="text-secondary">所有文章與標籤分類</h4>
      </div>
      
      {/* 移動端分類按鈕 */}
      <div className="d-md-none mb-3">
        <button 
          className="btn btn-info w-100" 
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? '隱藏熱門標籤' : '顯示熱門標籤'}
        </button>
      </div>
      
      <div className="row">
        <div className={`col-md-3 ${showSidebar ? 'd-block' : 'd-none d-md-block'}`}>
          <div className="card category-sidebar mb-4 h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">熱門標籤</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li 
                className={`list-group-item d-flex justify-content-between align-items-center ${!activeTag ? 'active' : ''}`}
                onClick={() => setActiveTag(null)}
                style={{ cursor: 'pointer' }}
              >
                全部標籤
                <span className="badge bg-info rounded-pill">{articles.length}</span>
              </li>
              {popularTags.map(tag => (
                <li 
                  key={tag.id} 
                  className={`list-group-item d-flex justify-content-between align-items-center ${activeTag === tag.name ? 'active' : ''}`}
                  onClick={() => setActiveTag(tag.name)}
                  style={{ cursor: 'pointer' }}
                >
                  {tag.name}
                  <span className="badge bg-info rounded-pill">{tag.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card content-area h-100">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {activeTag ? `包含「${activeTag}」標籤的文章` : '所有標籤'}
              </h5>
              {activeTag && (
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => setActiveTag(null)}
                >
                  返回所有標籤
                </button>
              )}
            </div>
            <div className="card-body">
              {!activeTag ? (
                <div className="row g-3">
                  {tags.map(tag => (
                    <div key={tag.id} className="col-6 col-sm-4 col-md-4 col-lg-3">
                      <div 
                        className="card h-100 tag-card"
                        onClick={() => setActiveTag(tag.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <h5 className="card-title">{tag.name}</h5>
                          <span className="badge bg-info rounded-pill">{tag.count} 篇文章</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row g-3">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                      <div key={article.id} className="col-12 col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">{article.title}</h5>
                            <div className="mt-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  {article.tags.map(tag => (
                                    <span 
                                      key={tag} 
                                      className={`badge me-1 ${tag === activeTag ? 'bg-info' : 'bg-secondary'}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTag(tag);
                                      }}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <small className="text-muted">{article.date}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">此標籤暫無文章</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;