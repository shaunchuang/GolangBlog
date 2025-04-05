import React from 'react';
import { useTranslation } from 'react-i18next';

const Categories: React.FC = () => {
  const { t } = useTranslation();

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

  const popularTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header mb-4">
        <h2>{t('nav.categories')}</h2>
        <h4 className="text-secondary">所有文章與標籤分類</h4>
      </div>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card category-sidebar mb-4 h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">熱門標籤</h5>
            </div>
            <ul className="list-group list-group-flush">
              {popularTags.map(tag => (
                <li key={tag.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {tag.name}
                  <span className="badge bg-info rounded-pill">{tag.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card content-area h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">所有標籤</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {tags.map(tag => (
                  <div key={tag.id} className="col-md-4 col-sm-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{tag.name}</h5>
                        <span className="badge bg-info rounded-pill">{tag.count} 篇文章</span>
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

export default Categories;