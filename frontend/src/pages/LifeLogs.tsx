import React from 'react';
import { useTranslation } from 'react-i18next';

const LifeLogs: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    { id: 1, name: '美食', count: 15 },
    { id: 2, name: '開箱', count: 7 },
    { id: 3, name: '旅遊', count: 9 },
    { id: 4, name: '生活小記', count: 13 }
  ];

  const lifeLogItems = [
    { id: 1, title: '台北最新米其林餐廳體驗，值得一試的創意料理', category: '美食', date: '2025-04-05' },
    { id: 2, title: '全新MacBook Pro 2025開箱，效能提升驚人', category: '開箱', date: '2025-04-03' },
    { id: 3, title: '沖繩自由行三日遊，隱藏版景點推薦', category: '旅遊', date: '2025-04-01' },
    { id: 4, title: '居家工作的效率提升技巧，讓你事半功倍', category: '生活小記', date: '2025-03-30' },
    { id: 5, title: '台中美食地圖，必吃小吃與餐廳總整理', category: '美食', date: '2025-03-28' },
    { id: 6, title: '最新無線耳機評測，音質與降噪表現大比拚', category: '開箱', date: '2025-03-25' }
  ];

  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h2>{t('nav.lifeLogs')}</h2>
        <h4 className="text-secondary">分享日常生活點滴</h4>
      </div>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card category-sidebar mb-4 h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">日誌分類</h5>
            </div>
            <ul className="list-group list-group-flush">
              {categories.map(category => (
                <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
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
              <h5 className="mb-0">生活日誌列表</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {lifeLogItems.map(log => (
                  <div key={log.id} className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{log.title}</h5>
                        <div className="d-flex justify-content-between mt-3">
                          <span className="badge bg-success">{log.category}</span>
                          <small className="text-muted">{log.date}</small>
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

export default LifeLogs;