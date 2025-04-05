import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/api';

type CategoryFormData = {
  name: string;
  slug: string;
  description: string;
  parent_id?: number | null;
};

/**
 * 分類編輯頁面
 * 用於創建新分類或編輯現有分類
 */
const CategoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  // 表單數據
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: null
  });

  // 頁面狀態
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);

  // 載入分類數據（如果是編輯模式）和可選的父分類
  useEffect(() => {
    const loadCategory = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await categoryService.getCategoryById(id);
        const category = response.data;
        
        setFormData({
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          parent_id: category.parent_id || null
        });
      } catch (err: any) {
        setError(err.response?.data?.error || '載入分類失敗');
      } finally {
        setLoading(false);
      }
    };
    
    const loadParentCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        // 如果是編輯模式，排除當前分類及其子分類（避免循環參照）
        const filteredCategories = isEditing 
          ? response.data.filter(cat => cat.id !== parseInt(id)) 
          : response.data;
        
        setParentCategories(filteredCategories || []);
      } catch (err: any) {
        console.error('載入父分類失敗', err);
      }
    };
    
    loadCategory();
    loadParentCategories();
  }, [id, isEditing]);

  // 處理表單字段變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 處理父分類選擇變更
  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value ? parseInt(e.target.value) : null;
    setFormData(prev => ({ ...prev, parent_id: parentId }));
  };

  // 從名稱自動生成 slug
  const generateSlugFromName = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
  };

  // 保存分類
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      let response;
      
      if (isEditing) {
        response = await categoryService.updateCategory(id, formData);
      } else {
        response = await categoryService.createCategory(formData);
      }
      
      setSuccess(`分類已成功${isEditing ? '更新' : '創建'}`);
      
      // 如果是創建新分類，跳轉到編輯頁面
      if (!isEditing && response.data && response.data.id) {
        setTimeout(() => {
          navigate(`/admin/categories/edit/${response.data.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || `${isEditing ? '更新' : '創建'}分類失敗`);
    } finally {
      setSaving(false);
    }
  };

  // 返回分類列表
  const handleCancel = () => {
    navigate('/admin/categories');
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

  return (
    <div className="container py-4">
      <h1 className="mb-4">{isEditing ? '編輯分類' : '新增分類'}</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* 名稱 */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">分類名稱</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="form-text">分類名稱應簡短明確，例如：技術、生活隨筆、旅遊</div>
            </div>
            
            {/* Slug */}
            <div className="mb-3">
              <label htmlFor="slug" className="form-label">
                Slug
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={generateSlugFromName}
                >
                  從名稱生成
                </button>
              </label>
              <input
                type="text"
                className="form-control"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
              <div className="form-text">Slug 用於 URL 中，只能包含小寫字母、數字和連字符</div>
            </div>
            
            {/* 描述 */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">描述（選填）</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
              <div className="form-text">簡短描述此分類包含的內容類型</div>
            </div>
            
            {/* 父分類 */}
            <div className="mb-3">
              <label htmlFor="parent_id" className="form-label">父分類（選填）</label>
              <select
                className="form-select"
                id="parent_id"
                name="parent_id"
                value={formData.parent_id || ''}
                onChange={handleParentChange}
              >
                <option value="">-- 無父分類 --</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="form-text">選擇一個父分類可以建立分類階層</div>
            </div>
            
            {/* 按鈕 */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
              >
                取消
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '保存中...' : '保存分類'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;