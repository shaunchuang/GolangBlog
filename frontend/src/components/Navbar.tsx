import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faNewspaper, faTags, faBook, faCar, faLaptop, faMoneyBill, 
  faGlobe, faUtensils, faBoxOpen, faPlaneDeparture, faBook as faJournal,
  faTools, faCalculator, faExchangeAlt, faGasPump, faFileCode, faRulerCombined
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import './Navbar.css'; // 引入自定義 CSS

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
            </ul>
            
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
              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
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
      </nav>

      {/* 下拉選單空間容器 */}
      <div className={`dropdown-menu-space ${activeDropdown ? 'show' : ''}`}>
        {activeDropdown && (
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

            {/* Tools Dropdown Content - 新增小工具內容 */}
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
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;