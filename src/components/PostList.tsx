import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

const PostList: React.FC = () => {
  const { posts } = usePosts();
  const { isAuthenticated } = useAuth();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2 flex items-center justify-between">
            <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline">
              {post.title} <span className="text-gray-500 text-sm">({post.date})</span>
            </Link>
            {isAuthenticated && (
              <Link to={`/admin/edit/${post.id}`} className="ml-4 text-sm text-indigo-600 hover:underline">
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
