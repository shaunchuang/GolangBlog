import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { ActionType } from '../types/state';
import { authService } from '../services/authService';

/**
 * 登入頁面
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 獲取用戶嘗試訪問的路由，登入成功後將重定向到該路由
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 通知 reducer 開始登入請求
      dispatch({ type: ActionType.LOGIN_REQUEST });

      // 呼叫登入 API
      const response = await authService.login({ email, password });

      // 登入成功，更新 reducer 狀態
      dispatch({
        type: ActionType.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      // 導航到用戶原本嘗試訪問的頁面，或首頁
      navigate(from, { replace: true });
    } catch (err: any) {
      // 登入失敗，更新錯誤狀態
      const errorMessage = err.response?.data?.error || '登入失敗，請檢查您的憑證';
      setError(errorMessage);
      dispatch({
        type: ActionType.LOGIN_FAILURE,
        payload: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">登入</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">電子郵件</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">密碼</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '登入中...' : '登入'}
                  </button>
                </div>
              </form>

              <div className="mt-3 text-center">
                <p className="mb-0">
                  還沒有帳戶？ <a href="/register">註冊</a>
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