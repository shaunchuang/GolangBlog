import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { articleService } from '../services/articleService';
import { Article } from '../types/api';

/**
 * 文章詳情頁面
 * 顯示單篇文章的完整內容
 */
const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 檢查當前用戶是否有編輯權限
  const hasEditPermission = () => {
    if (!state.auth.user) return false;
    return ['admin', 'editor'].includes(state.auth.user.role);
  };

  // 載入文章數據
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await articleService.getArticleById(id);
        setArticle(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || '載入文章失敗');
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [id]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 返回文章列表
  const handleGoBack = () => {
    navigate('/articles');
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">加載中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        <h4 className="alert-heading">發生錯誤</h4>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-outline-danger" 
            onClick={handleGoBack}
          >
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="alert alert-warning my-5" role="alert">
        <h4 className="alert-heading">找不到文章</h4>
        <p>無法找到此文章，它可能已被刪除或您沒有權限訪問。</p>
        <hr />
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-outline-warning" 
            onClick={handleGoBack}
          >
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* 文章頭部 */}
      <div className="mb-4">
        <button 
          className="btn btn-sm btn-outline-secondary mb-3"
          onClick={handleGoBack}
        >
          <i className="bi bi-arrow-left me-1"></i> 返回文章列表
        </button>
        
        <h1 className="display-4 mb-3">{article.title}</h1>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted">
            {article.published_at && (
              <span>發佈於 {formatDate(article.published_at)}</span>
            )}
            {article.author && (
              <span className="ms-3">作者: {article.author.username}</span>
            )}
          </div>
          
          {/* 編輯按鈕（僅對有權限的用戶顯示） */}
          {hasEditPermission() && (
            <Link 
              to={`/admin/articles/edit/${article.id}`} 
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-pencil me-1"></i> 編輯文章
            </Link>
          )}
        </div>
      </div>
      
      {/* 文章特色圖片 */}
      {article.featured_image && (
        <div className="text-center mb-4">
          <img 
            src={article.featured_image} 
            alt={article.title} 
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
      )}
      
      {/* 文章分類和標籤 */}
      <div className="d-flex gap-3 mb-4">
        {article.category && (
          <div>
            <span className="badge bg-primary fs-6">
              {article.category.name}
            </span>
          </div>
        )}
        
        {article.tags && article.tags.length > 0 && (
          <div className="d-flex gap-1 flex-wrap">
            {article.tags.map(tag => (
              <span key={tag.id} className="badge bg-secondary fs-6">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* 文章摘要 */}
      {article.excerpt && (
        <div className="card bg-light mb-4">
          <div className="card-body">
            <p className="lead mb-0 fst-italic">{article.excerpt}</p>
          </div>
        </div>
      )}
      
      {/* 文章內容 */}
      <div className="article-content mb-5">
        {article.content && (
          <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>
      
      {/* 文章底部 */}
      <div className="border-top pt-4 mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {article.updated_at && article.updated_at !== article.created_at && (
              <small className="text-muted">
                最後更新於 {formatDate(article.updated_at)}
              </small>
            )}
          </div>
          
          <div>
            <button 
              className="btn btn-outline-secondary"
              onClick={handleGoBack}
            >
              返回文章列表
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;