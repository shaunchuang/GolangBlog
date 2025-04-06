import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ActionType } from '../types/state';
import { authService } from '../services/authService';

/**
 * 用戶註冊頁面
 */
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // 確認密碼是否匹配
    if (password !== confirmPassword) {
      setError('密碼與確認密碼不匹配');
      return;
    }

    setLoading(true);

    try {
      // 使用 authService 註冊
      await authService.register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });

      // 註冊成功
      setSuccessMessage('註冊成功！即將為您跳轉到登入頁面...');
      
      // 添加成功提示
      dispatch({
        type: ActionType.ADD_ALERT,
        payload: { type: 'success', message: '註冊成功，請登入您的帳戶' }
      });

      // 延遲後跳轉到登入頁面
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      // 註冊失敗，顯示錯誤訊息
      const errorMessage = err.response?.data?.error || '註冊失敗，請稍後再試或聯絡管理員';
      setError(errorMessage);
      
      dispatch({
        type: ActionType.ADD_ALERT,
        payload: { type: 'danger', message: errorMessage }
      });
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
              <h2 className="card-title text-center mb-4">註冊新帳戶</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">用戶名 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">電子郵件 <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">名字</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">姓氏</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">密碼 <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <small className="form-text text-muted">密碼至少需要6個字符</small>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">確認密碼 <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '註冊中...' : '註冊'}
                  </button>
                </div>
              </form>

              <div className="mt-3 text-center">
                <p className="mb-0">
                  已經有帳戶？ <a href="/login">登入</a>
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