import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/tokenService.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// register User
export const registerUser = async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    logger.info({ userId: user.id }, "New user registered");
    return { id: user.id, name: user.name, email: user.email };
};

// login user
export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Invalid credentials', 401);

    const token = generateToken({ id: user.id, email: user.email });
    logger.info({ userId: user.id }, "User logged in");

    return { token, user: { id: user.id, name: user.name, email: user.email } };
};