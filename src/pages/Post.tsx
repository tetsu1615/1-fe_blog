import { useParams } from 'react-router-dom';
import { loadPosts } from '../posts';
import ReactMarkdown from 'react-markdown';

const posts = loadPosts();

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.meta.slug === slug);

  if (!post) return <div>記事が見つかりません</div>;


  return (
    <div className="p-6 prose">
      <h1>{post.meta.title}</h1>
      <p className="text-sm text-gray-500">{post.meta.date}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
}

