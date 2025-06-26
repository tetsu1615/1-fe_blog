import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Post from './components/Post';
import Container from './components/Container';
import PostList from './components/PostList';
import { usePosts } from './hooks/usePosts';
import AnimatedRoutes from './components/AnimatedRoutes';
import PostEditor from './components/PostEditor';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

export const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { getPostById } = usePosts();
  const [postContent, setPostContent] = useState('');
  const [postDate, setPostDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (postId) {
      const post = getPostById(postId);
      if (post) {
        setPostContent(post.content);
        setPostDate(post.date);
      } else {
        setPostContent('# Post Not Found\n\nSorry, the post you are looking for does not exist.');
        setPostDate(undefined);
      }
    }
  }, [postId, getPostById]);

  return (
    <motion.main
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Link to="/" className="text-blue-600 hover:underline mb-4 block">← Back to all posts</Link>
      <Post content={postContent} date={postDate} />
    </motion.main>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? <>{children}</> : null;
};

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="bg-gray-800 text-white p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-left"><Link to="/">1-fe blog</Link></h1>
          <nav>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                  Create New Post
                </Link>
                <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Admin Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div className="flex-grow">
        <Container>
          <AnimatedRoutes />
        </Container>
      </div>
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; {new Date().getFullYear()} 1-fe blog. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
