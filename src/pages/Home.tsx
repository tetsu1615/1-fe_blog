import { useState, useEffect } from 'react';
import { loadPosts } from '../posts';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log(loadPosts());
    setPosts(loadPosts());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">ブログ</h1>
      <ul className="space-y-4">
        {posts.map(({ meta }) => (
          <li key={meta.slug}>
            <Link to={`/post/${meta.slug}`} className="text-blue-600 hover:underline">
              {meta.title}
            </Link>
            <p className="text-sm text-gray-500">{meta.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
