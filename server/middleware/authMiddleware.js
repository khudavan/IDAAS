import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export function authRequired(req, res, next) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing token' });
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'missing token' });
  const role = (req.user.role || '').toString().toLowerCase();
  if (role !== 'admin') return res.status(403).json({ error: 'admin only' });
  return next();
}
