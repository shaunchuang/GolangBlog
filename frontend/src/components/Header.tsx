import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css'; // 導入 Header 樣式

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 處理深色/淺色模式切換
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };
  
  // 更新當前時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 每分鐘更新一次
    
    return () => clearInterval(timer);
  }, []);
  
  // 格式化時間
  const formattedTime = currentTime.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
  
  // 格式化日期
  const formattedDate = currentTime.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return (
    <header className={`py-3 shadow-sm ${isDarkMode ? 'bg-dark text-white' : 'bg-gradient-primary text-dark'}`}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 d-flex justify-content-md-start justify-content-center mb-2 mb-md-0">
            <Link to="/" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>
              <div className="d-flex align-items-center">
                <div className="logo-container me-3">
                  <FontAwesomeIcon icon={faGlobe} className="logo-icon fa-2x spin-slow" />
                </div>
                <div>
                  <h1 className="m-0 fs-3 fw-bold brand-text">
                    <span className="text-primary">SJ</span>
                    <span className="text-secondary">-</span>
                    <span className="text-info">Sphere</span>
                  </h1>
                  <p className="m-0 small brand-slogan">探索科技新視界</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-4 text-center d-none d-md-block">
            <div className="date-time-container">
              <div className="current-time fw-bold">{formattedTime}</div>
              <div className="current-date small">{formattedDate}</div>
            </div>
          </div>
          
          <div className="col-md-4 d-flex justify-content-md-end justify-content-center">
            <div className="d-flex align-items-center">
              <button 
                className={`btn btn-sm theme-toggle-btn ${isDarkMode ? 'btn-light' : 'btn-dark'}`}
                onClick={toggleDarkMode}
                aria-label="切換深淺色模式"
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                <span className="ms-2 d-none d-sm-inline">
                  {isDarkMode ? '切換淺色模式' : '切換深色模式'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;