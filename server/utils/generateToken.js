// server/utils/generateToken.js
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const TTL = process.env.JWT_TTL || '1h';

export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: TTL });
}
