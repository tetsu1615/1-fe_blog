import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostProps {
  content: string;
  date?: string;
}

const Post: React.FC<PostProps> = ({ content, date }) => {
  return (
    <div className="prose lg:prose-xl mx-auto p-4 leading-loose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="mb-4 font-bold" {...props}>
              {props.children}
              {date && <small className="text-sm text-gray-500 mt-1 block">{date}</small>}
            </h1>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Post;
