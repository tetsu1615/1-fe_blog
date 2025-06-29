import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Post from './Post';
import { usePosts } from '../hooks/usePosts';

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
