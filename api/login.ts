import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 環境変数を安全に取得
const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH,
  JWT_SECRET,
} = process.env;

// Vercel が起動時に即座にクラッシュさせてログを残す
if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  console.error('[ConfigError] Missing required environment variables.');
  throw new Error('Server misconfiguration: Missing required environment variables');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // メソッドチェック
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Content-Type チェック（セキュリティ強化）
  const contentType = req.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    return res.status(400).json({ message: 'Invalid content type. Expected application/json.' });
  }

  let username: string;
  let password: string;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    username = body?.username;
    password = body?.password;

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('Invalid username or password format');
    }
  } catch (err) {
    console.error('[ParseError]', err);
    return res.status(400).json({ message: 'Malformed or missing JSON in request body.' });
  }

  try {
    // パスワードの照合
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH as string);

    if (username === ADMIN_USERNAME && passwordMatch) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('[LoginError]', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
