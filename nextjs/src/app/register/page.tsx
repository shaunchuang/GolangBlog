'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import { authService } from '@/services/authService';
import { ActionType } from '@/types/state';

/**
 * 註冊頁面
 * 讓新用戶創建帳號
 */
const Register = () => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { isAuthenticated } = state.auth;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證表單
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors([]);

    try {
      // 通知 reducer 開始註冊請求
      dispatch({ type: ActionType.REGISTER_REQUEST });
      
      // 調用註冊 API
      const response = await authService.register(
        formData.username,
        formData.email,
        formData.password
      );
      
      // 註冊成功，更新 reducer 狀態
      dispatch({
        type: ActionType.REGISTER_SUCCESS,
        payload: {
          token: response.token,
          user: response.user
        }
      });

      // 重定向到首頁
      router.push('/');
    } catch (err: any) {
      console.error('註冊錯誤:', err);
      
      // 註冊失敗，更新 reducer 狀態
      dispatch({
        type: ActionType.REGISTER_FAILURE,
        payload: err.response?.data?.error || '註冊失敗，請稍後重試'
      });
      
      // 設置錯誤信息
      if (err.response?.data?.errors) {
        setErrors(Array.isArray(err.response.data.errors) 
          ? err.response.data.errors 
          : [err.response.data.errors]);
      } else if (err.response?.data?.error) {
        setErrors([err.response.data.error]);
      } else {
        setErrors(['註冊失敗，請稍後重試']);
      }
    } finally {
      setLoading(false);
    }
  };

  // 表單驗證邏輯
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.username.trim()) {
      errors.push('用戶名不能為空');
    }
    
    if (!formData.email.trim()) {
      errors.push('電子郵件不能為空');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('請輸入有效的電子郵件地址');
    }
    
    if (!formData.password) {
      errors.push('密碼不能為空');
    } else if (formData.password.length < 6) {
      errors.push('密碼長度不能少於6個字符');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('兩次輸入的密碼不匹配');
    }
    
    return errors;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">創建新帳號</h2>
              
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
                  <label htmlFor="username" className="form-label">用戶名</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                  />
                </div>
                
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
                    autoComplete="new-password"
                  />
                  <div className="form-text">
                    密碼長度不能少於6個字符
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">確認密碼</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
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
                    ) : '註冊'}
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <p>
                  已有帳號？ <Link href="/login" className="text-decoration-none">登入</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
