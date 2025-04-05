import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ActionType } from '../types/state';
import { articleService } from '../services/articleService';
import { Article } from '../types/api';

/**
 * 文章列表頁面
 * 顯示所有文章的列表，包含分頁、搜索和篩選功能
 */
const ArticlesList = () => {
  const { state, dispatch } = useAppContext();
  const { items: articles, loading, error, pagination } = state.articles;

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  // 加載文章列表
  const loadArticles = async (page = 1) => {
    try {
      dispatch({ type: ActionType.FETCH_ARTICLES_REQUEST });

      // 構建查詢參數
      const params: any = {
        page,
        page_size: 10,
        order_by: 'created_at',
        order_dir: 'desc'
      };

      // 添加搜索和篩選參數
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedTag) params.tag_id = selectedTag;

      const response = await articleService.getArticles(params);
      
      dispatch({
        type: ActionType.FETCH_ARTICLES_SUCCESS,
        payload: {
          items: response.data,
          pagination: {
            total: response.total,
            page: response.page,
            pageSize: response.page_size,
            totalPages: response.total_pages
          }
        }
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '加載文章失敗';
      dispatch({
        type: ActionType.FETCH_ARTICLES_FAILURE,
        payload: errorMessage
      });
    }
  };

  // 處理頁面變更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 處理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadArticles(1);
  };

  // 處理重置篩選
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedTag(null);
    setCurrentPage(1);
    loadArticles(1);
  };

  // 在頁面載入或篩選/頁碼變更時加載文章
  useEffect(() => {
    loadArticles(currentPage);
  }, [currentPage, selectedCategory, selectedTag]);

  // 生成分頁導航
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="文章分頁導航">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              上一頁
            </button>
          </li>
          
          {pages}
          
          <li className={`page-item ${currentPage === pagination.totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // 渲染文章卡片
  const renderArticleCard = (article: Article) => {
    return (
      <div key={article.id} className="card mb-4 shadow-sm h-100">
        {article.featured_image && (
          <img
            src={article.featured_image}
            className="card-img-top"
            alt={article.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{article.title}</h5>
          
          <p className="card-text text-muted small">
            {new Date(article.published_at || article.created_at).toLocaleDateString('zh-TW')}
            {article.author && ` • ${article.author.username}`}
          </p>
          
          <p className="card-text flex-grow-1">
            {article.excerpt || article.content?.substring(0, 150)}...
          </p>
          
          <div className="mt-auto">
            {article.tags && article.tags.length > 0 && (
              <div className="mb-2">
                {article.tags.map(tag => (
                  <span key={tag.id} className="badge bg-secondary me-1">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            
            <Link to={`/articles/${article.id}`} className="btn btn-primary">
              閱讀更多
            </Link>
            
            {/* 僅對編輯者和管理員顯示編輯按鈕 */}
            {state.auth.user && ['admin', 'editor'].includes(state.auth.user.role) && (
              <Link to={`/admin/articles/edit/${article.id}`} className="btn btn-outline-secondary ms-2">
                編輯
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">文章列表</h1>
      
      {/* 搜索和篩選區域 */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                搜索
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
              >
                重置
              </button>
            </div>
          </form>
          
          {/* 這裡可以加入分類和標籤篩選 */}
        </div>
      </div>
      
      {/* 錯誤提示 */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* 加載指示器 */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">加載中...</span>
          </div>
        </div>
      )}
      
      {/* 文章列表 */}
      {!loading && articles.length === 0 && (
        <div className="alert alert-info">
          沒有找到符合條件的文章。
        </div>
      )}
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {articles.map(article => (
          <div key={article.id} className="col">
            {renderArticleCard(article)}
          </div>
        ))}
      </div>
      
      {/* 分頁導航 */}
      <div className="mt-4">
        {renderPagination()}
      </div>
      
      {/* 僅對編輯者和管理員顯示新增文章按鈕 */}
      {state.auth.user && ['admin', 'editor'].includes(state.auth.user.role) && (
        <div className="text-center mt-4">
          <Link to="/admin/articles/new" className="btn btn-success">
            <i className="bi bi-plus-circle me-2"></i>
            新增文章
          </Link>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;