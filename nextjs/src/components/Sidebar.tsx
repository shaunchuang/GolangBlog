import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faUser, faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" id="sidebarMenu">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/" className="nav-link d-flex align-items-center">
              <FontAwesomeIcon icon={faHome} className="me-2" />
              <span>首頁</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/articles" className="nav-link d-flex align-items-center">
              <FontAwesomeIcon icon={faNewspaper} className="me-2" />
              <span>文章列表</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/categories" className="nav-link d-flex align-items-center">
              <FontAwesomeIcon icon={faTags} className="me-2" />
              <span>分類</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/archives" className="nav-link d-flex align-items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              <span>文章歸檔</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about" className="nav-link d-flex align-items-center">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <span>關於我</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;