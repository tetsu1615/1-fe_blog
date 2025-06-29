import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// JWT検証ミドルウェア風関数
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication token required.' });
    return false;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
    return false;
  }
};

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === 'POST') {
    if (!verifyToken(req, res)) return;
  }

  switch (method) {
    case 'GET':
      try {
        const fileNames = fs.readdirSync(postsDirectory);
        const posts = fileNames.map((fileName) => {
          const id = fileName.replace(/\.md$/, '');
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          return { id, title: data.title, date: data.date };
        });
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching posts.', error: error.message });
      }
      break;

    case 'POST':
      try {
        const { id, title, date, content } = body;
        if (!id || !title || !date || !content) {
          return res.status(400).json({ message: 'ID, title, date, and content are required.' });
        }
        const filePath = path.join(postsDirectory, `${id}.md`);
        if (fs.existsSync(filePath)) {
          return res.status(409).json({ message: 'Post with this ID already exists.' });
        }
        const newContent = matter.stringify(content, { title, date });
        fs.writeFileSync(filePath, newContent, 'utf8');
        res.status(201).json({ message: 'Post created successfully.' });
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post.', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
