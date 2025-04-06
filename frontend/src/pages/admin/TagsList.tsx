import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tagService } from '../../services/tagService';
import { Tag } from '../../types/api';

/**
 * 標籤管理列表頁面
 * 顯示所有標籤並提供管理功能
 */
const TagsList = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 載入標籤列表
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await tagService.getTags();
        setTags(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || '載入標籤失敗');
      } finally {
        setLoading(false);
      }
    };
    
    loadTags();
  }, []);

  // 打開刪除確認模態框
  const handleDeleteClick = (id: number) => {
    setDeleteTagId(id);
    setShowDeleteModal(true);
  };

  // 關閉刪除確認模態框
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setDeleteTagId(null);
  };

  // 刪除標籤
  const handleConfirmDelete = async () => {
    if (!deleteTagId) return;
    
    setIsDeleting(true);
    
    try {
      await tagService.deleteTag(deleteTagId);
      
      // 更新本地標籤列表
      setTags(tags.filter(tag => tag.id !== deleteTagId));
      
      // 關閉模態框
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.error || '刪除標籤失敗');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>標籤管理</h1>
        <Link to="/admin/tags/new" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>新增標籤
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
      
      {/* 標籤列表 */}
      {!loading && (
        <>
          {tags.length === 0 ? (
            <div className="alert alert-info">
              目前沒有標籤。點擊「新增標籤」按鈕創建您的第一個標籤。
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
                      <th scope="col">文章數</th>
                      <th scope="col">建立時間</th>
                      <th scope="col" style={{ width: '150px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map(tag => (
                      <tr key={tag.id}>
                        <td>{tag.id}</td>
                        <td>
                          <span className="badge bg-secondary">{tag.name}</span>
                        </td>
                        <td>{tag.slug}</td>
                        <td>{tag.article_count || 0}</td>
                        <td>{new Date(tag.created_at).toLocaleDateString('zh-TW')}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link to={`/admin/tags/edit/${tag.id}`} className="btn btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button 
                              type="button" 
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteClick(tag.id)}
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
                <p>您確定要刪除這個標籤嗎？</p>
                <p className="text-danger">
                  <small>
                    <strong>注意：</strong> 如果有文章使用了此標籤，刪除後這些文章將不再具有此標籤。此操作無法撤銷。
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

export default TagsList;