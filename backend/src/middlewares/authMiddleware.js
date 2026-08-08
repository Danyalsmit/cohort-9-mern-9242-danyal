import { verifyToken } from '../utils/tokenService.js';
import AppError from '../utils/AppError.js';
import prisma from '../config/prisma.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const blacklisted = await prisma.blacklistedToken.findUnique({ where: { token } });
    if (blacklisted) {
      return next(new AppError('Token has been revoked, please login again', 401));
    }

    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};