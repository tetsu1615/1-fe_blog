import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PostList from './PostList';
import { PostPage } from '../App'; // Assuming PostPage is exported from App.tsx
import PostEditor from './PostEditor';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <PostList />
          </motion.div>
        } />
        <Route path="/posts/:postId" element={<PostPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
        <Route path="/admin/edit/:postId" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
