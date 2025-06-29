import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Must match the secret in api/login.ts

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
  const { method, body } = request;

  // Apply JWT verification for POST requests
  if (method === 'POST') {
    // Wrap the handler logic in a promise to use async/await with middleware pattern
    await new Promise<void>((resolve) => {
      verifyToken(request, response, () => {
        resolve();
      });
    });
    if (response.statusCode !== 200) return; // If verifyToken sent a response, stop execution
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
        response.status(200).json(posts);
      } catch (error) {
        response.status(500).json({ message: 'Error fetching posts.', error: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        const { id, title, date, content } = body;
        if (!id || !title || !date || !content) {
          return response.status(400).json({ message: 'ID, title, date, and content are required.' });
        }
        const filePath = path.join(postsDirectory, `${id}.md`);
        if (fs.existsSync(filePath)) {
          return response.status(409).json({ message: 'Post with this ID already exists.' });
        }
        const newContent = matter.stringify(content, { title, date });
        fs.writeFileSync(filePath, newContent, 'utf8');
        response.status(201).json({ message: 'Post created successfully.' });
      } catch (error) {
        console.error('Error creating post:', error);
        response.status(500).json({ message: 'Error creating post.', error: (error as Error).message });
      }
      break;

    default:
      response.setHeader('Allow', ['GET', 'POST']);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
}