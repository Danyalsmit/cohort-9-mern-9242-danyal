import { verifyToken } from '../utils/tokenService.js';
import AppError from '../utils/AppError.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};