import React from 'react';
import { useTranslation } from 'react-i18next';

const News: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    { id: 1, name: '汽車', count: 12 },
    { id: 2, name: '科技', count: 8 },
    { id: 3, name: '財經', count: 5 },
    { id: 4, name: '國際', count: 10 }
  ];

  const newsItems = [
    { id: 1, title: '特斯拉推出新一代電動車，續航力突破700公里', category: '汽車', date: '2025-04-04' },
    { id: 2, title: 'AI新技術可預測股市走向，準確率達85%', category: '科技', date: '2025-04-03' },
    { id: 3, title: '美元匯率創下近期新高，對全球經濟影響深遠', category: '財經', date: '2025-04-02' },
    { id: 4, title: '歐盟宣布新環保政策，2030年前禁售燃油車', category: '國際', date: '2025-04-01' },
    { id: 5, title: '最新自動駕駛系統問世，安全係數提升50%', category: '汽車', date: '2025-03-30' },
    { id: 6, title: '量子計算取得重大突破，處理速度提升百倍', category: '科技', date: '2025-03-29' }
  ];

  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h2>{t('nav.news')}</h2>
        <h4 className="text-secondary">最新新聞動態</h4>
      </div>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card category-sidebar mb-4 h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">新聞分類</h5>
            </div>
            <ul className="list-group list-group-flush">
              {categories.map(category => (
                <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {category.name}
                  <span className="badge bg-primary rounded-pill">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card content-area h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">新聞列表</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {newsItems.map(news => (
                  <div key={news.id} className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{news.title}</h5>
                        <div className="d-flex justify-content-between mt-3">
                          <span className="badge bg-primary">{news.category}</span>
                          <small className="text-muted">{news.date}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;