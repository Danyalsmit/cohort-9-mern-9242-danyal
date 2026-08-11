import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET?.trim();

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing or empty. Please set it in your .env file.');
}

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const hashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
};