import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { tagService } from '../services/tagService';
import { categoryService } from '../services/categoryService';
import { Tag, Category } from '../types/api';
import Quill from 'quill'; // 引入 Quill
import 'quill/dist/quill.snow.css'; // 引入 Quill 的樣式

type ArticleFormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  featured_image: string;
  category_id: number | null;
  tag_ids: number[];
};

type NewTagData = {
  name: string;
  slug: string;
  description: string;
};

/**
 * 文章編輯頁面
 * 用於創建新文章或編輯現有文章
 */
const ArticleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  // 表單數據
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    featured_image: '',
    category_id: null,
    tag_ids: []
  });

  // 頁面狀態
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 選項列表
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // 新標籤表單
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagData, setNewTagData] = useState<NewTagData>({
    name: '',
    slug: '',
    description: ''
  });
  const [creatingTag, setCreatingTag] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  // 載入文章數據（如果是編輯模式）
  useEffect(() => {
    const loadArticle = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await articleService.getArticleById(id);
        const article = response.data;
        
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          content: article.content || '',
          excerpt: article.excerpt || '',
          status: article.status || 'draft',
          featured_image: article.featured_image || '',
          category_id: article.category_id || null,
          tag_ids: article.tags ? article.tags.map((tag: Tag) => tag.id) : []
        });
      } catch (err: any) {
        setError(err.response?.data?.error || '載入文章失敗');
      } finally {
        setLoading(false);
      }
    };
    
    // 載入分類和標籤
    const loadOptions = async () => {
      try {
        // 從API加載分類和標籤列表
        const categoriesResponse = await categoryService.getCategories();
        const tagsResponse = await tagService.getTags();
        
        setCategories(categoriesResponse.data || []);
        setTags(tagsResponse.data || []);
      } catch (err) {
        console.error('載入選項失敗', err);
      }
    };
    
    loadArticle();
    loadOptions();
  }, [id, isEditing]);

  // 初始化 Quill 編輯器
  useEffect(() => {
    const quill = new Quill('#editor', {
      theme: 'snow', // 使用 Snow 主題
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image']
        ]
      }
    });

    // 設置 Quill 的內容
    quill.on('text-change', () => {
      setFormData((prev) => ({
        ...prev,
        content: quill.root.innerHTML
      }));
    });

    // 如果是編輯模式，載入文章內容
    if (isEditing) {
      setLoading(true);
      articleService.getArticleById(id)
        .then((response) => {
          const article = response.data;
          setFormData({
            title: article.title || '',
            slug: article.slug || '',
            content: article.content || '',
            excerpt: article.excerpt || '',
            status: article.status || 'draft',
            featured_image: article.featured_image || '',
            category_id: article.category_id || null,
            tag_ids: article.tags ? article.tags.map((tag: Tag) => tag.id) : []
          });
          quill.root.innerHTML = article.content || '';
        })
        .catch((err) => {
          setError('載入文章失敗');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  // 處理表單字段變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 處理分類選擇變更
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value ? parseInt(e.target.value) : null;
    setFormData(prev => ({ ...prev, category_id: categoryId }));
  };

  // 從標題自動生成 slug
  const generateSlugFromTitle = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
  };

  // 從標籤名稱自動生成 slug
  const generateSlugFromTagName = () => {
    const slug = newTagData.name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setNewTagData(prev => ({ ...prev, slug }));
  };

  // 處理新標籤表單字段變更
  const handleNewTagInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTagData(prev => ({ ...prev, [name]: value }));
  };

  // 創建新標籤
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證表單數據
    if (!newTagData.name || !newTagData.slug) {
      setTagError('標籤名稱和Slug為必填項');
      return;
    }
    
    setCreatingTag(true);
    setTagError(null);
    
    try {
      // 呼叫API創建新標籤
      const response = await tagService.createTag(newTagData);
      const newTag = response.data;
      
      // 添加新標籤到列表
      setTags(prevTags => [...prevTags, newTag]);
      
      // 將新標籤添加到已選擇的標籤
      setFormData(prev => ({
        ...prev,
        tag_ids: [...prev.tag_ids, newTag.id]
      }));
      
      // 重置表單並關閉它
      setNewTagData({ name: '', slug: '', description: '' });
      setShowNewTagForm(false);
      
    } catch (err: any) {
      setTagError(err.response?.data?.error || '創建標籤失敗');
    } finally {
      setCreatingTag(false);
    }
  };

  // 保存文章
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      let response;
      
      // 準備提交的數據
      const articleData = {
        ...formData,
        // 碮保 tag_ids 是一個數組
        tag_ids: formData.tag_ids || []
      };
      
      if (isEditing) {
        response = await articleService.updateArticle(id, articleData);
      } else {
        response = await articleService.createArticle(articleData);
      }
      
      setSuccess(`文章已成功${isEditing ? '更新' : '創建'}`);
      
      // 如果是創建新文章，跳轉到編輯頁面
      if (!isEditing && response.data && response.data.id) {
        setTimeout(() => {
          navigate(`/admin/articles/edit/${response.data.id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || `${isEditing ? '更新' : '創建'}文章失敗`);
    } finally {
      setSaving(false);
    }
  };

  // 返回文章列表
  const handleCancel = () => {
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

  return (
    <div className="container py-4">
      <h1 className="mb-4">{isEditing ? '編輯文章' : '新增文章'}</h1>
      
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
            {/* 標題 */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">標題</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Slug */}
            <div className="mb-3">
              <label htmlFor="slug" className="form-label">
                Slug
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={generateSlugFromTitle}
                >
                  從標題生成
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
            </div>
            
            {/* 內容 */}
            <div className="mb-3">
              <label htmlFor="editor" className="form-label">內容</label>
              <div id="editor" style={{ height: '300px', backgroundColor: '#fff' }}></div>
            </div>
            
            {/* 摘要 */}
            <div className="mb-3">
              <label htmlFor="excerpt" className="form-label">摘要</label>
              <textarea
                className="form-control"
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
              />
            </div>
            
            {/* 特色圖片 */}
            <div className="mb-3">
              <label htmlFor="featured_image" className="form-label">特色圖片 URL</label>
              <input
                type="text"
                className="form-control"
                id="featured_image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
              />
              
              {formData.featured_image && (
                <div className="mt-2">
                  <img
                    src={formData.featured_image}
                    alt="預覽"
                    className="img-thumbnail"
                    style={{ maxHeight: '150px' }}
                  />
                </div>
              )}
            </div>
            
            {/* 分類 */}
            <div className="mb-3">
              <label htmlFor="category_id" className="form-label">分類</label>
              <select
                className="form-select"
                id="category_id"
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleCategoryChange}
              >
                <option value="">-- 選擇分類 --</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 標籤 */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor="tag_ids" className="form-label mb-0">標籤</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setShowNewTagForm(!showNewTagForm)}
                >
                  {showNewTagForm ? '取消新增' : '+ 新增標籤'}
                </button>
              </div>

              {/* 新增標籤表單 */}
              {showNewTagForm && (
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">新增標籤</h6>
                    
                    {tagError && (
                      <div className="alert alert-danger py-2 mb-3" role="alert">
                        {tagError}
                      </div>
                    )}
                    
                    <div> 
                      <div className="mb-2">
                        <label htmlFor="new-tag-name" className="form-label">標籤名稱</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="new-tag-name"
                          name="name"
                          value={newTagData.name}
                          onChange={handleNewTagInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-2">
                        <label htmlFor="new-tag-slug" className="form-label d-flex justify-content-between">
                          <span>Slug</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0"
                            onClick={generateSlugFromTagName}
                          >
                            從名稱生成
                          </button>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="new-tag-slug"
                          name="slug"
                          value={newTagData.slug}
                          onChange={handleNewTagInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="new-tag-description" className="form-label">描述（選填）</label>
                        <textarea
                          className="form-control form-control-sm"
                          id="new-tag-description"
                          name="description"
                          rows={2}
                          value={newTagData.description}
                          onChange={handleNewTagInputChange}
                        />
                      </div>
                      
                      <div className="d-flex justify-content-end">
                        <button
                          type="button" 
                          className="btn btn-sm btn-success"
                          disabled={creatingTag}
                          onClick={handleCreateTag} 
                        >
                          {creatingTag ? '創建中...' : '創建並添加'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 已有標籤多選框 */}
              <div className="card">
                <div className="card-body p-3">
                  {tags.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <div key={tag.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`tag-${tag.id}`}
                            checked={formData.tag_ids.includes(tag.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  tag_ids: [...prev.tag_ids, tag.id]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  tag_ids: prev.tag_ids.filter(id => id !== tag.id)
                                }));
                              }
                            }}
                          />
                          <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                            {tag.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">目前沒有可用的標籤，請新增標籤。</p>
                  )}
                </div>
              </div>
              <small className="form-text text-muted mt-2">
                選擇文章相關的標籤，或創建新標籤
              </small>
            </div>
            
            {/* 狀態 */}
            <div className="mb-3">
              <label htmlFor="status" className="form-label">狀態</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">草稿</option>
                <option value="published">已發布</option>
                <option value="archived">已歸檔</option>
              </select>
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
              
              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? '保存中...' : '保存文章'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleEdit;