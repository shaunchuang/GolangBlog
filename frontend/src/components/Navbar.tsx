import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faTags, faBook, faCar, faLaptop, faMoneyBill, faGlobe, faUtensils, faBoxOpen, faPlaneDeparture, faBook as faJournal } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import './Navbar.css'; // 引入自定義 CSS

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // 初始化Bootstrap的Dropdown
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
        // Bootstrap will be automatically initialized
      }).catch(e => console.error('Failed to load Bootstrap:', e));
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link d-flex align-items-center">
                <FontAwesomeIcon icon={faHome} className="me-1" />
                <span>{t('nav.home')}</span>
              </Link>
            </li>
            
            {/* News Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="newsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FontAwesomeIcon icon={faNewspaper} className="me-1" />
                <span>{t('nav.news')}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-horizontal" aria-labelledby="newsDropdown">
                <div className="horizontal-dropdown-content">
                  <div className="dropdown-header">最新新聞動態</div>
                  <div className="horizontal-items">
                    <Link to="/news?category=car" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faCar} className="mb-2" size="lg" />
                      <span>汽車</span>
                    </Link>
                    <Link to="/news?category=tech" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faLaptop} className="mb-2" size="lg" />
                      <span>科技</span>
                    </Link>
                    <Link to="/news?category=finance" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faMoneyBill} className="mb-2" size="lg" />
                      <span>財經</span>
                    </Link>
                    <Link to="/news?category=world" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faGlobe} className="mb-2" size="lg" />
                      <span>國際</span>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            
            {/* Life Logs Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="lifeLogsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FontAwesomeIcon icon={faBook} className="me-1" />
                <span>{t('nav.lifeLogs')}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-horizontal" aria-labelledby="lifeLogsDropdown">
                <div className="horizontal-dropdown-content">
                  <div className="dropdown-header">分享日常生活點滴</div>
                  <div className="horizontal-items">
                    <Link to="/life-logs?category=food" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faUtensils} className="mb-2" size="lg" />
                      <span>美食</span>
                    </Link>
                    <Link to="/life-logs?category=unboxing" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faBoxOpen} className="mb-2" size="lg" />
                      <span>開箱</span>
                    </Link>
                    <Link to="/life-logs?category=travel" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faPlaneDeparture} className="mb-2" size="lg" />
                      <span>旅遊</span>
                    </Link>
                    <Link to="/life-logs?category=diary" className="dropdown-item d-flex flex-column align-items-center">
                      <FontAwesomeIcon icon={faJournal} className="mb-2" size="lg" />
                      <span>生活小記</span>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            
            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FontAwesomeIcon icon={faTags} className="me-1" />
                <span>{t('nav.categories')}</span>
              </a>
              <div className="dropdown-menu dropdown-menu-horizontal" aria-labelledby="categoriesDropdown">
                <div className="horizontal-dropdown-content">
                  <div className="dropdown-header">所有文章與標籤分類</div>
                  <div className="horizontal-items">
                    <Link to="/categories?tag=React" className="dropdown-item d-flex flex-column align-items-center">
                      <span className="tag-icon react-icon">R</span>
                      <span>React</span>
                      <span className="badge bg-info rounded-pill mt-1">22</span>
                    </Link>
                    <Link to="/categories?tag=Golang" className="dropdown-item d-flex flex-column align-items-center">
                      <span className="tag-icon golang-icon">G</span>
                      <span>Golang</span>
                      <span className="badge bg-info rounded-pill mt-1">18</span>
                    </Link>
                    <Link to="/categories?tag=TypeScript" className="dropdown-item d-flex flex-column align-items-center">
                      <span className="tag-icon typescript-icon">TS</span>
                      <span>TypeScript</span>
                      <span className="badge bg-info rounded-pill mt-1">15</span>
                    </Link>
                    <Link to="/categories?tag=Frontend" className="dropdown-item d-flex flex-column align-items-center">
                      <span className="tag-icon frontend-icon">FE</span>
                      <span>Frontend</span>
                      <span className="badge bg-info rounded-pill mt-1">20</span>
                    </Link>
                    <Link to="/categories?tag=Backend" className="dropdown-item d-flex flex-column align-items-center">
                      <span className="tag-icon backend-icon">BE</span>
                      <span>Backend</span>
                      <span className="badge bg-info rounded-pill mt-1">16</span>
                    </Link>
                  </div>
                </div>
              </div>
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
  );
};

export default Navbar;