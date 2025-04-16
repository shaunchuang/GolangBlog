'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import { authService } from '@/services/authService';
import { ActionType } from '@/types/state';

/**
 * 登入頁面
 * 讓用戶進行帳號登入
 */
const Login = () => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { isAuthenticated } = state.auth;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 如果用戶已登入，重定向到首頁
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 處理表單輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 簡單驗證
    if (!formData.email.trim() || !formData.password) {
      setErrors(['電子郵件和密碼不能為空']);
      return;
    }
    
    setLoading(true);
    setErrors([]);

    try {
      // 通知 reducer 開始登入請求
      dispatch({ type: ActionType.LOGIN_REQUEST });
      
      // 調用登入 API
      const response = await authService.login(
        formData.email,
        formData.password
      );

      // 如果選擇記住我，設置本地存儲標記
      if (formData.rememberMe) {
        localStorage.setItem('auth_remember', 'true');
      }
      
      // 登入成功，更新 reducer 狀態
      dispatch({
        type: ActionType.LOGIN_SUCCESS,
        payload: {
          token: response.token,
          user: response.user
        }
      });

      // 重定向到首頁
      router.push('/');
    } catch (err: any) {
      console.error('登入錯誤:', err);
      
      // 登入失敗，更新 reducer 狀態
      dispatch({
        type: ActionType.LOGIN_FAILURE,
        payload: err.response?.data?.error || '登入失敗，請稍後重試'
      });
      
      // 設置錯誤信息
      if (err.response?.data?.errors) {
        setErrors(Array.isArray(err.response.data.errors) 
          ? err.response.data.errors 
          : [err.response.data.errors]);
      } else if (err.response?.data?.error) {
        setErrors([err.response.data.error]);
      } else {
        setErrors(['登入失敗，請稍後重試']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">登入您的帳號</h2>
              
              {errors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">電子郵件</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">密碼</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                  />
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    記住我
                  </label>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        處理中...
                      </>
                    ) : '登入'}
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <p>
                  還沒有帳號？ <Link href="/register" className="text-decoration-none">註冊</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
