import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

const PostList: React.FC = () => {
  const { posts } = usePosts();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2">
            <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline">
              {post.title} <span className="text-gray-500 text-sm">({post.date})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
