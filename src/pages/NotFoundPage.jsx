import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-button">
          <FiHome /> Go to Home
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;