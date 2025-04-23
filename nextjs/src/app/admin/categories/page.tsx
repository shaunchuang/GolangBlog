"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/api';

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data);
      } catch (error) {
        setError('無法獲取分類列表');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteCategoryId === null) return;

    setIsDeleting(true);

    try {
      await categoryService.deleteCategory(deleteCategoryId);
      setCategories(categories.filter(category => category.id !== deleteCategoryId));
    } catch (error) {
      setError('刪除分類失敗');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>分類管理</h1>
        <Link href="/admin/categories/new" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>新增分類
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading && <div>載入中...</div>}
      
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
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>名稱</th>
                      <th>Slug</th>
                      <th>描述</th>
                      <th>文章數</th>
                      <th>創建日期</th>
                      <th>操作</th>
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
                            <Link href={`/admin/categories/edit/${category.id}`} className="btn btn-outline-primary">
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
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">確認刪除</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>您確定要刪除此分類嗎？此操作無法撤銷。</p>
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

export default CategoriesList;