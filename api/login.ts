import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// 環境変数取得
const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

// 初期チェック
if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  console.error('Missing required environment variables.');
  throw new Error('Server misconfiguration: Missing environment variables');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ message: 'Invalid content type. Expected application/json.' });
  }

  let username: string | undefined;
  let password: string | undefined;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    username = body.username;
    password = body.password;
  } catch {
    return res.status(400).json({ message: 'Malformed JSON in request body.' });
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (username === ADMIN_USERNAME && passwordMatch) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('Login processing error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
