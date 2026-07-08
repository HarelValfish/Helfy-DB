const pool = require('../db');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const [tokens] = await pool.query('SELECT * FROM user_tokens WHERE token = ?', [token]);

    if (tokens.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const tokenRow = tokens[0];

    if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    const [users] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [tokenRow.user_id]);

    req.user = users[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { requireAuth };