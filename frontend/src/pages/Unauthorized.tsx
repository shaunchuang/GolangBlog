import { Link } from 'react-router-dom';

/**
 * 未授權頁面
 * 當用戶嘗試訪問沒有權限的頁面時顯示
 */
const Unauthorized = () => {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-5">
              <h1 className="display-4 mb-4">
                <i className="bi bi-shield-exclamation text-danger me-3"></i>
                訪問被拒絕
              </h1>
              
              <p className="lead mb-4">
                您沒有足夠的權限訪問此頁面。
              </p>
              
              <p className="text-muted mb-4">
                如果您認為這是一個錯誤，請聯絡系統管理員或返回首頁。
              </p>
              
              <div className="d-flex justify-content-center gap-3">
                <Link to="/" className="btn btn-primary px-4">
                  返回首頁
                </Link>
                <Link to="/login" className="btn btn-outline-secondary px-4">
                  重新登入
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;