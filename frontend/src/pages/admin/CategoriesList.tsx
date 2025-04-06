import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/api';

/**
 * 分類管理列表頁面
 * 顯示所有分類並提供管理功能
 */
const CategoriesList = () => {
  // Use the useAppContext hook instead of useContext
  // Commenting out as it seems we don't actually use state or dispatch in this component
  // const { state, dispatch } = useAppContext();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 載入分類列表
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || '載入分類失敗');
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // 打開刪除確認模態框
  const handleDeleteClick = (id: number) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  // 關閉刪除確認模態框
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
  };

  // 刪除分類
  const handleConfirmDelete = async () => {
    if (!deleteCategoryId) return;
    
    setIsDeleting(true);
    
    try {
      await categoryService.deleteCategory(deleteCategoryId);
      
      // 更新本地分類列表
      setCategories(categories.filter(category => category.id !== deleteCategoryId));
      
      // 關閉模態框
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.error || '刪除分類失敗');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>分類管理</h1>
        <Link to="/admin/categories/new" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>新增分類
        </Link>
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
      
      {/* 分類列表 */}
      {!loading && (
        <>
          {categories.length === 0 ? (
            <div className="alert alert-info">
              目前沒有分類。點擊「新增分類」按鈕創建您的第一個分類。
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">名稱</th>
                      <th scope="col">Slug</th>
                      <th scope="col">描述</th>
                      <th scope="col">文章數</th>
                      <th scope="col">建立時間</th>
                      <th scope="col" style={{ width: '150px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>
                          <span className="badge bg-primary">{category.name}</span>
                        </td>
                        <td>{category.slug}</td>
                        <td>
                          {category.description ? (
                            category.description.length > 30 
                              ? `${category.description.substring(0, 30)}...` 
                              : category.description
                          ) : (
                            <span className="text-muted">無描述</span>
                          )}
                        </td>
                        <td>{category.article_count || 0}</td>
                        <td>{new Date(category.created_at).toLocaleDateString('zh-TW')}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button 
                              type="button" 
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteClick(category.id)}
                              disabled={(category.article_count || 0) > 0}
                              title={(category.article_count || 0) > 0 ? "此分類有關聯文章，無法刪除" : "刪除分類"}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* 刪除確認模態框 */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">確認刪除</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>您確定要刪除這個分類嗎？</p>
                <p className="text-danger">
                  <small>
                    <strong>注意：</strong> 此操作無法撤銷。如果有文章使用了此分類，您將無法刪除此分類。
                  </small>
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                >
                  取消
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '刪除中...' : '確認刪除'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;