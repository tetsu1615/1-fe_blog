//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');

//const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
//const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
//const JWT_SECRET = process.env.JWT_SECRET;

//if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
//  console.error('[ConfigError] Missing required environment variables.');
//  throw new Error('Server misconfiguration: Missing required environment variables');
//}

//module.exports = async function handler(req, res) {
//  if (req.method !== 'POST') {
//    res.setHeader('Allow', ['POST']);
//    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//  }

//  const contentType = req.headers['content-type'];
//  if (!contentType || !contentType.includes('application/json')) {
//    return res.status(400).json({ message: 'Invalid content type. Expected application/json.' });
//  }

//  let username;
//  let password;

//  try {
//    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
//    username = body.username;
//    password = body.password;

//    if (typeof username !== 'string' || typeof password !== 'string') {
//      throw new Error('Invalid username or password format');
//    }
//  } catch (err) {
//    console.error('[ParseError]', err);
//    return res.status(400).json({ message: 'Malformed or missing JSON in request body.' });
//  }

//  try {
//    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

//    if (username === ADMIN_USERNAME && passwordMatch) {
//      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
//      return res.status(200).json({ token });
//    } else {
//      return res.status(401).json({ message: 'Invalid credentials.' });
//    }
//  } catch (err) {
//    console.error('[LoginError]', err);
//    return res.status(500).json({ message: 'Internal server error.' });
//  }
//};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // デバッグ用: bodyの中身を確認（あとで削除）
  console.log('Received POST', req.body);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const { username, password } = body;

    if (username === 'admin' && password === 'password') {
      return res.status(200).json({ token: 'dummy-token' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Parse error:', err);
    return res.status(400).json({ message: 'Malformed request' });
  }
};
