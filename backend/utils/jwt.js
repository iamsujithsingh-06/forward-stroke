import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';
const EXPIRES_IN = '7d';

export function generateToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
