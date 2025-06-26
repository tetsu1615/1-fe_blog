import { useEffect, useState } from 'react';
import matter from 'gray-matter';

interface PostMetaData {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface UsePostsResult {
  posts: PostMetaData[];
  getPostById: (id: string) => PostMetaData | undefined;
}

// Dynamically import markdown files with their raw content
const markdownFiles: Record<string, string> = import.meta.glob('../posts/*.md', { as: 'raw', eager: true });

export const usePosts = (): UsePostsResult => {
  const [posts, setPosts] = useState<PostMetaData[]>([]);

  useEffect(() => {
    const loadedPosts: PostMetaData[] = [];
    for (const path in markdownFiles) {
      const rawContent = markdownFiles[path];
      const { data, content } = matter(rawContent);
      const id = path.split('/').pop()?.replace('.md', '') || '';
      if (data.title && data.date && id) {
        loadedPosts.push({
          id,
          title: data.title as string,
          date: data.date as string,
          content,
        });
      }
    }
    // Sort posts by date, newest first
    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setPosts(loadedPosts);
  }, []);

  const getPostById = (id: string): PostMetaData | undefined => {
    return posts.find(post => post.id === id);
  };

  return {
    posts,
    getPostById,
  };
};