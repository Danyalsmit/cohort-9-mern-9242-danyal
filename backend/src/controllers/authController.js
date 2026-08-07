// src/controllers/authController.js
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken } from '../utils/tokenService.js';
import AppError from '../utils/AppError.js';


// Sign Up Logic 
export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError('All fields required', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400);
    }

    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
});



// Login Logic
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400);
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
    });

    logger.info(`User logged in: ${email}`);

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
});

// Logout Logic
export const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};