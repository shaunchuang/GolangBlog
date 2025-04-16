import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tagService } from '@/services/tagService';
import { Tag } from '@/types/api';

const TagsList = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getTags();
        setTags(response.data);
      } catch (error) {
        setError('無法加載標籤');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteTagId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTagId === null) return;

    setIsDeleting(true);

    try {
      await tagService.deleteTag(deleteTagId);
      setTags(tags.filter(tag => tag.id !== deleteTagId));
    } catch (error) {
      setError('無法刪除標籤');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteTagId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>標籤管理</h1>
        <Link href="/admin/tags/new" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>新增標籤
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading && <div>加載中...</div>}
      
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
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>名稱</th>
                      <th>Slug</th>
                      <th>文章數量</th>
                      <th>創建日期</th>
                      <th>操作</th>
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
                            <Link href={`/admin/tags/edit/${tag.id}`} className="btn btn-outline-primary">
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
      
      {showDeleteModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">確認刪除</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>您確定要刪除此標籤嗎？此操作無法撤銷。</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>取消</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
                  {isDeleting ? '刪除中...' : '刪除'}
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