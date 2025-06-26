import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// IMPORTANT: In a real application, these would be securely stored environment variables
// and the user would be fetched from a database.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Hashed password
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Change this to a strong, random secret

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ message: 'Username and password are required.' });
  }

  if (!ADMIN_PASSWORD_HASH) {
    console.error('ADMIN_PASSWORD_HASH environment variable is not set.');
    return response.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    // Compare provided password with hashed password
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (username === ADMIN_USERNAME && passwordMatch) {
      // Generate JWT
      const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '1h' });
      return response.status(200).json({ token });
    } else {
      return response.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return response.status(500).json({ message: 'Internal server error.' });
  }
}
