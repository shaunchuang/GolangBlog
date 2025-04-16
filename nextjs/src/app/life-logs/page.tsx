'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';

const LifeLogs: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam || null);
  const [showSidebar, setShowSidebar] = useState(false);

  const categories = [
    { id: 1, name: '美食', count: 15, slug: 'food' },
    { id: 2, name: '開箱', count: 7, slug: 'unboxing' },
    { id: 3, name: '旅遊', count: 9, slug: 'travel' },
    { id: 4, name: '生活小記', count: 13, slug: 'diary' }
  ];

  const lifeLogItems = [
    { id: 1, title: '台北最新米其林餐廳體驗，值得一試的創意料理', category: '美食', categorySlug: 'food', date: '2025-04-05' },
    { id: 2, title: '全新MacBook Pro 2025開箱，效能提升驚人', category: '開箱', categorySlug: 'unboxing', date: '2025-04-03' },
    { id: 3, title: '沖繩自由行三日遊，隱藏版景點推薦', category: '旅遊', categorySlug: 'travel', date: '2025-04-01' },
    { id: 4, title: '居家工作的效率提升技巧，讓你事半功倍', category: '生活小記', categorySlug: 'diary', date: '2025-03-30' },
    { id: 5, title: '台中美食地圖，必吃小吃與餐廳總整理', category: '美食', categorySlug: 'food', date: '2025-03-28' },
    { id: 6, title: '最新無線耳機評測，音質與降噪表現大比拚', category: '開箱', categorySlug: 'unboxing', date: '2025-03-25' }
  ];

  // 根據選中的分類過濾生活日誌
  const filteredLifeLogs = activeCategory 
    ? lifeLogItems.filter(item => item.categorySlug === activeCategory)
    : lifeLogItems;

  useEffect(() => {
    // 更新選中的分類
    setActiveCategory(categoryParam || null);
  }, [categoryParam]);

  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h2>{t('nav.lifeLogs')}</h2>
        <h4 className="text-secondary">分享日常生活點滴</h4>
      </div>
      
      {/* 移動端分類按鈕 */}
      <div className="d-md-none mb-3">
        <button 
          className="btn btn-primary w-100" 
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? '隱藏分類' : '顯示分類'}
        </button>
      </div>
      
      <div className="row">
        <div className={`col-md-3 ${showSidebar ? 'd-block' : 'd-none d-md-block'}`}>
          <div className="card category-sidebar mb-4 h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">生活分類</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li 
                className={`list-group-item d-flex justify-content-between align-items-center ${!activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(null)}
                style={{ cursor: 'pointer' }}
              >
                全部
                <span className="badge bg-success rounded-pill">{lifeLogItems.length}</span>
              </li>
              {categories.map(category => (
                <li 
                  key={category.id} 
                  className={`list-group-item d-flex justify-content-between align-items-center ${activeCategory === category.slug ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  {category.name}
                  <span className="badge bg-success rounded-pill">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card content-area h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">生活日誌列表 {activeCategory ? `- ${categories.find(c => c.slug === activeCategory)?.name}` : ''}</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {filteredLifeLogs.length > 0 ? (
                  filteredLifeLogs.map(item => (
                    <div key={item.id} className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{item.title}</h5>
                          <div className="d-flex justify-content-between mt-3">
                            <span className="badge bg-success">{item.category}</span>
                            <small className="text-muted">{item.date}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">此分類暫無日誌</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeLogs;
