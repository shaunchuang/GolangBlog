import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faNewspaper, faTags, faBook, faCar, faLaptop, faMoneyBill, 
  faGlobe, faUtensils, faBoxOpen, faPlaneDeparture, faBook as faJournal,
  faTools, faCalculator, faExchangeAlt, faGasPump, faFileCode, faRulerCombined,
  faUserShield, faListAlt, faEdit, faCogs, faSignInAlt, faSignOutAlt, faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useContext } from 'react';
import { AppContext, useAppContext } from '../contexts/AppContext';
import { ActionType } from '../types/state';
import './Navbar.css'; // 引入自定義 CSS

const Navbar = () => {
  const { t, i18n } = useTranslation();
  // Option 1: Use the custom hook (recommended)
  const { state, dispatch } = useAppContext();
  // Option 2: Or use the context directly with proper type checking
  // const context = useContext(AppContext);
  // if (!context) throw new Error('Navbar must be used within an AppProvider');
  // const { state, dispatch } = context;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated, user } = state.auth;

  // 檢查用戶是否有管理員權限
  const hasAdminAccess = () => {
    return user && ['admin', 'editor'].includes(user.role);
  };

  // 登出處理函數
  const handleLogout = () => {
    dispatch({ type: ActionType.LOGOUT });
    // 如果需要，可以導航到登入頁面或首頁
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // 處理下拉選單的開啟和關閉
  const handleDropdownToggle = (dropdownId: string) => {
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownId);
    }
  };

  // 關閉所有下拉選單
  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  // 點擊頁面其他地方時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar') && !target.closest('.dropdown-menu-horizontal')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 初始化Bootstrap的Dropdown
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
        // Bootstrap will be automatically initialized
      }).catch(e => console.error('Failed to load Bootstrap:', e));
    }
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link d-flex align-items-center" onClick={closeAllDropdowns}>
                  <FontAwesomeIcon icon={faHome} className="me-1" />
                  <span>{t('nav.home')}</span>
                </Link>
              </li>
              
              {/* News Dropdown */}
              <li className="nav-item dropdown">
                <a 
                  className={`nav-link dropdown-toggle d-flex align-items-center ${activeDropdown === 'newsDropdown' ? 'show' : ''}`} 
                  href="#" 
                  id="newsDropdown" 
                  role="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownToggle('newsDropdown');
                  }}
                  aria-expanded={activeDropdown === 'newsDropdown'}
                >
                  <FontAwesomeIcon icon={faNewspaper} className="me-1" />
                  <span>{t('nav.news')}</span>
                </a>
              </li>
              
              {/* Life Logs Dropdown */}
              <li className="nav-item dropdown">
                <a 
                  className={`nav-link dropdown-toggle d-flex align-items-center ${activeDropdown === 'lifeLogsDropdown' ? 'show' : ''}`} 
                  href="#" 
                  id="lifeLogsDropdown" 
                  role="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownToggle('lifeLogsDropdown');
                  }}
                  aria-expanded={activeDropdown === 'lifeLogsDropdown'}
                >
                  <FontAwesomeIcon icon={faBook} className="me-1" />
                  <span>{t('nav.lifeLogs')}</span>
                </a>
              </li>
              
              {/* Categories Dropdown */}
              <li className="nav-item dropdown">
                <a 
                  className={`nav-link dropdown-toggle d-flex align-items-center ${activeDropdown === 'categoriesDropdown' ? 'show' : ''}`} 
                  href="#" 
                  id="categoriesDropdown" 
                  role="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownToggle('categoriesDropdown');
                  }}
                  aria-expanded={activeDropdown === 'categoriesDropdown'}
                >
                  <FontAwesomeIcon icon={faTags} className="me-1" />
                  <span>{t('nav.categories')}</span>
                </a>
              </li>
              
              {/* Tools Dropdown */}
              <li className="nav-item dropdown">
                <a 
                  className={`nav-link dropdown-toggle d-flex align-items-center ${activeDropdown === 'toolsDropdown' ? 'show' : ''}`} 
                  href="#" 
                  id="toolsDropdown" 
                  role="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownToggle('toolsDropdown');
                  }}
                  aria-expanded={activeDropdown === 'toolsDropdown'}
                >
                  <FontAwesomeIcon icon={faTools} className="me-1" />
                  <span>{t('nav.tools')}</span>
                </a>
              </li>
              
              {/* 管理選項 - 僅對管理員和編輯者顯示 */}
              {hasAdminAccess() && (
                <li className="nav-item dropdown">
                  <a 
                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeDropdown === 'adminDropdown' ? 'show' : ''}`} 
                    href="#" 
                    id="adminDropdown" 
                    role="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('adminDropdown');
                    }}
                    aria-expanded={activeDropdown === 'adminDropdown'}
                  >
                    <FontAwesomeIcon icon={faUserShield} className="me-1" />
                    <span>管理</span>
                  </a>
                </li>
              )}
            </ul>
            
            <div className="d-flex align-items-center">
              {/* 用戶認證選項 */}
              <div className="dropdown me-3">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={isAuthenticated ? faUserCircle : faSignInAlt} className="me-1" />
                  <span>{isAuthenticated ? (user?.username || '用戶') : '登入/註冊'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  {isAuthenticated ? (
                    <>
                      <li className="dropdown-item-text">
                        <small className="text-muted">以 <strong>{user?.role || '用戶'}</strong> 身份登入</small>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                          個人資料
                        </Link>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                          登出
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="dropdown-item">
                          <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                          登入
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="dropdown-item">
                          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                          註冊
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* 語言切換選項 */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t('nav.language')}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('en')}>
                      English
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('zh')}>
                      中文
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 下拉選單空間容器 */}
      <div className={`dropdown-menu-space ${activeDropdown ? 'show' : ''}`}>
        <div className="container position-relative px-0">
          {/* News Dropdown Content */}
          {activeDropdown === 'newsDropdown' && (
            <div className="dropdown-menu dropdown-menu-horizontal show" aria-labelledby="newsDropdown">
              <div className="horizontal-dropdown-content px-0">
                <div className="dropdown-header">最新新聞動態</div>
                <div className="horizontal-items">
                  <Link to="/news?category=car" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faCar} className="mb-2" size="lg" />
                    <span>汽車</span>
                  </Link>
                  <Link to="/news?category=tech" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faLaptop} className="mb-2" size="lg" />
                    <span>科技</span>
                  </Link>
                  <Link to="/news?category=finance" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faMoneyBill} className="mb-2" size="lg" />
                    <span>財經</span>
                  </Link>
                  <Link to="/news?category=world" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faGlobe} className="mb-2" size="lg" />
                    <span>國際</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Life Logs Dropdown Content */}
          {activeDropdown === 'lifeLogsDropdown' && (
            <div className="dropdown-menu dropdown-menu-horizontal show" aria-labelledby="lifeLogsDropdown">
              <div className="horizontal-dropdown-content px-0">
                <div className="dropdown-header">分享日常生活點滴</div>
                <div className="horizontal-items">
                  <Link to="/life-logs?category=food" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faUtensils} className="mb-2" size="lg" />
                    <span>美食</span>
                  </Link>
                  <Link to="/life-logs?category=unboxing" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faBoxOpen} className="mb-2" size="lg" />
                    <span>開箱</span>
                  </Link>
                  <Link to="/life-logs?category=travel" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faPlaneDeparture} className="mb-2" size="lg" />
                    <span>旅遊</span>
                  </Link>
                  <Link to="/life-logs?category=diary" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faJournal} className="mb-2" size="lg" />
                    <span>生活小記</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Categories Dropdown Content */}
          {activeDropdown === 'categoriesDropdown' && (
            <div className="dropdown-menu dropdown-menu-horizontal show" aria-labelledby="categoriesDropdown">
              <div className="horizontal-dropdown-content px-0">
                <div className="dropdown-header">所有文章與標籤分類</div>
                <div className="horizontal-items">
                  <Link to="/categories?tag=React" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <span className="tag-icon react-icon">R</span>
                    <span>React</span>
                    <span className="badge bg-info rounded-pill mt-1">22</span>
                  </Link>
                  <Link to="/categories?tag=Golang" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <span className="tag-icon golang-icon">G</span>
                    <span>Golang</span>
                    <span className="badge bg-info rounded-pill mt-1">18</span>
                  </Link>
                  <Link to="/categories?tag=TypeScript" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <span className="tag-icon typescript-icon">TS</span>
                    <span>TypeScript</span>
                    <span className="badge bg-info rounded-pill mt-1">15</span>
                  </Link>
                  <Link to="/categories?tag=Frontend" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <span className="tag-icon frontend-icon">FE</span>
                    <span>Frontend</span>
                    <span className="badge bg-info rounded-pill mt-1">20</span>
                  </Link>
                  <Link to="/categories?tag=Backend" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <span className="tag-icon backend-icon">BE</span>
                    <span>Backend</span>
                    <span className="badge bg-info rounded-pill mt-1">16</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tools Dropdown Content */}
          {activeDropdown === 'toolsDropdown' && (
            <div className="dropdown-menu dropdown-menu-horizontal show" aria-labelledby="toolsDropdown">
              <div className="horizontal-dropdown-content px-0">
                <div className="dropdown-header">{t('tools.title')}</div>
                <div className="horizontal-items">
                  <Link to="/tools/loan-calculator" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <div className="tool-icon calculator-icon">
                      <FontAwesomeIcon icon={faCalculator} className="mb-2" size="lg" />
                    </div>
                    <span>{t('tools.loanCalculator')}</span>
                    <span className="badge bg-secondary rounded-pill mt-1">{t('tools.loanCalculatorDesc')}</span>
                  </Link>
                  <Link to="/tools/base64" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <div className="tool-icon code-icon">
                      <FontAwesomeIcon icon={faFileCode} className="mb-2" size="lg" />
                    </div>
                    <span>{t('tools.base64')}</span>
                    <span className="badge bg-secondary rounded-pill mt-1">{t('tools.base64Desc')}</span>
                  </Link>
                  <Link to="/tools/unit-converter" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <div className="tool-icon unit-icon">
                      <FontAwesomeIcon icon={faRulerCombined} className="mb-2" size="lg" />
                    </div>
                    <span>{t('tools.unitConverter')}</span>
                    <span className="badge bg-secondary rounded-pill mt-1">{t('tools.unitConverterDesc')}</span>
                  </Link>
                  <Link to="/tools/currency" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <div className="tool-icon currency-icon">
                      <FontAwesomeIcon icon={faExchangeAlt} className="mb-2" size="lg" />
                    </div>
                    <span>{t('tools.currency')}</span>
                    <span className="badge bg-secondary rounded-pill mt-1">{t('tools.currencyDesc')}</span>
                  </Link>
                  <Link to="/tools/gas-price" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <div className="tool-icon gas-icon">
                      <FontAwesomeIcon icon={faGasPump} className="mb-2" size="lg" />
                    </div>
                    <span>{t('tools.gasPrice')}</span>
                    <span className="badge bg-secondary rounded-pill mt-1">{t('tools.gasPriceDesc')}</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* 管理員選項下拉選單內容 */}
          {activeDropdown === 'adminDropdown' && (
            <div className="dropdown-menu dropdown-menu-horizontal show" aria-labelledby="adminDropdown">
              <div className="horizontal-dropdown-content px-0">
                <div className="dropdown-header">管理選項</div>
                <div className="horizontal-items">
                  <Link to="/admin/articles" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faListAlt} className="mb-2" size="lg" />
                    <span>文章管理</span>
                  </Link>
                  <Link to="/admin/categories" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faTags} className="mb-2" size="lg" />
                    <span>分類管理</span>
                  </Link>
                  <Link to="/admin/tags" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                    <FontAwesomeIcon icon={faEdit} className="mb-2" size="lg" />
                    <span>標籤管理</span>
                  </Link>
                  {user && user.role === 'admin' && (
                    <Link to="/admin/settings" className="dropdown-item d-flex flex-column align-items-center" onClick={closeAllDropdowns}>
                      <FontAwesomeIcon icon={faCogs} className="mb-2" size="lg" />
                      <span>系統設置</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;