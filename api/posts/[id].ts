import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT
const verifyToken = (req: VercelRequest, res: VercelResponse, next: () => void) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { method, query, body } = request;
  const { id } = query;
  const filePath = path.join(postsDirectory, `${id}.md`);

  // Apply JWT verification for PUT and DELETE requests
  if (method === 'PUT' || method === 'DELETE') {
    await new Promise<void>((resolve) => {
      verifyToken(request, response, () => {
        resolve();
      });
    });
    if (response.statusCode !== 200) return;
  }

  switch (method) {
    case 'GET':
      try {
        if (!fs.existsSync(filePath)) {
          return response.status(404).json({ message: 'Post not found.' });
        }
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        response.status(200).json({ ...data, content });
      } catch (error) {
        response.status(500).json({ message: 'Error fetching post.', error: (error as Error).message });
      }
      break;

    case 'PUT':
      try {
        const { title, date, content } = body;
        if (!title || !date || !content) {
          return response.status(400).json({ message: 'Title, date, and content are required.' });
        }
        const newContent = matter.stringify(content, { title, date });
        fs.writeFileSync(filePath, newContent, 'utf8');
        response.status(200).json({ message: 'Post updated successfully.' });
      } catch (error) {
        response.status(500).json({ message: 'Error updating post.', error: (error as Error).message });
      }
      break;

    case 'DELETE':
      try {
        if (!fs.existsSync(filePath)) {
          return response.status(404).json({ message: 'Post not found.' });
        }
        fs.unlinkSync(filePath);
        response.status(200).json({ message: 'Post deleted successfully.' });
      } catch {
        response.status(500).json({ message: 'Error deleting post.' });
      }
      break;

    default:
      response.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
}