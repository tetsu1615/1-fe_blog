import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// JWT検証関数
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
  const { method, query, body } = req;
  const { id } = query;
  const filePath = path.join(postsDirectory, `${id}.md`);

  if (method === 'PUT' || method === 'DELETE') {
    if (!verifyToken(req, res)) return;
  }

  switch (method) {
    case 'GET':
      try {
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ message: 'Post not found.' });
        }
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        res.status(200).json({ ...data, content });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching post.', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { title, date, content } = body;
        if (!title || !date || !content) {
          return res.status(400).json({ message: 'Title, date, and content are required.' });
        }
        const newContent = matter.stringify(content, { title, date });
        fs.writeFileSync(filePath, newContent, 'utf8');
        res.status(200).json({ message: 'Post updated successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error updating post.', error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ message: 'Post not found.' });
        }
        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'Post deleted successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting post.', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
