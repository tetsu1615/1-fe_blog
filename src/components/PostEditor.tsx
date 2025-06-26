import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, setApiConfig } from '../services/api';

interface PostFormData {
  id: string;
  title: string;
  date: string;
  content: string;
}

const PostEditor: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth(); // Get token from context

  const [formData, setFormData] = useState<PostFormData>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0], // Default to current date
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setApiConfig({ token });
    }
  }, [token]);

  useEffect(() => {
    if (postId) {
      // Fetch existing post data for editing
      setLoading(true);
      api.getPost(postId)
        .then((data) => {
          setFormData({
            id: data.id,
            title: data.data.title,
            date: data.data.date,
            content: data.content,
          });
          setLoading(false);
        })
        .catch((e) => {
          setError(`Failed to fetch post: ${e.message}`);
          setLoading(false);
        });
    } else {
      // For new post, ensure ID is empty
      setFormData(prev => ({ ...prev, id: '' }));
    }
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (postId) {
        await api.updatePost(postId, formData);
        alert('Post updated successfully!');
      } else {
        await api.createPost(formData);
        alert('Post created successfully!');
      }
      navigate('/'); // Navigate back to the post list
    } catch (e) {
      setError(`Failed to ${postId ? 'update' : 'create'} post: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{postId ? 'Edit Post' : 'Create New Post'}</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!postId && (
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post ID (e.g., my-new-post)</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
          <textarea
            id="content"
            name="content"
            rows={15}
            value={formData.content}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Saving...' : (postId ? 'Update Post' : 'Create Post')}
        </button>
      </form>
    </div>
  );
};

export default PostEditor;
