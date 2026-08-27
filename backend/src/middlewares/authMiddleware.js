import { verifyToken, hashToken } from '../utils/tokenService.js';
import AppError from '../utils/AppError.js';
import prisma from '../config/prisma.js';

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    const tokenHash = hashToken(token);

    try {
        const blacklisted = await prisma.blacklistedToken.findUnique({ where: { token: tokenHash } });
        if (blacklisted) {
            return next(new AppError('Token has been revoked, please login again', 401));
        }
    } catch (err) {
        return next(err);
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (err) {
        return next(new AppError('Invalid or expired token', 401));
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        req.user = user;
        req.tokenExp = decoded.exp;        
        next();
    } catch (err) {
        next(err); 
    }
};