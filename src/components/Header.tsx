import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-6 shadow-lg mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-left"><Link to="/">1-fe blog</Link></h1>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/admin/new" className="bg-indigo-600 hover:bg-indigo-700 !text-white font-bold py-2 px-4 rounded">
                Create New Post
              </Link>
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
