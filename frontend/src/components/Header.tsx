import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white py-3 shadow">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/" className="text-white text-decoration-none">
            <FontAwesomeIcon icon={faBlog} className="me-2" />
            <h1 className="m-0 fs-3 d-inline">Golang Blog</h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;