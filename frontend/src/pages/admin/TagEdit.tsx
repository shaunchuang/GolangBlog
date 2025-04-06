import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tagService } from '../../services/tagService';

type TagFormData = {
  name: string;
  slug: string;
  description: string;
};

/**
 * 標籤編輯頁面
 * 用於創建新標籤或編輯現有標籤
 */
const TagEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  // 表單數據
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    slug: '',
    description: ''
  });

  // 頁面狀態
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 載入標籤數據（如果是編輯模式）
  useEffect(() => {
    const loadTag = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await tagService.getTagById(id);
        const tag = response.data;
        
        setFormData({
          name: tag.name || '',
          slug: tag.slug || '',
          description: tag.description || ''
        });
      } catch (err: any) {
        setError(err.response?.data?.error || '載入標籤失敗');
      } finally {
        setLoading(false);
      }
    };
    
    loadTag();
  }, [id, isEditing]);

  // 處理表單字段變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 從名稱自動生成 slug
  const generateSlugFromName = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
  };

  // 保存標籤
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      let response;
      
      if (isEditing) {
        response = await tagService.updateTag(id, formData);
      } else {
        response = await tagService.createTag(formData);
      }
      
      setSuccess(`標籤已成功${isEditing ? '更新' : '創建'}`);
      
      // 如果是創建新標籤，跳轉到編輯頁面
      if (!isEditing && response.data && response.data.id) {
        setTimeout(() => {
          navigate(`/admin/tags/edit/${response.data.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || `${isEditing ? '更新' : '創建'}標籤失敗`);
    } finally {
      setSaving(false);
    }
  };

  // 返回標籤列表
  const handleCancel = () => {
    navigate('/admin/tags');
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
      <h1 className="mb-4">{isEditing ? '編輯標籤' : '新增標籤'}</h1>
      
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
              <label htmlFor="name" className="form-label">標籤名稱</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="form-text">標籤名稱建議簡短明確，例如：Golang、前端開發、React</div>
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
              <div className="form-text">簡短描述此標籤的作用或包含的內容類型</div>
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
                {saving ? '保存中...' : '保存標籤'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TagEdit;