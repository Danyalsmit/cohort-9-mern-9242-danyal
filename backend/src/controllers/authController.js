import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';
import { registerUser, loginUser } from '../services/authService.js';
import prisma from '../config/prisma.js';

// signup controller
export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) throw new AppError('All fields required', 400);
    if (!isValidEmail(email)) throw new AppError('Invalid email format', 400);
    if (!isValidPassword(password)) throw new AppError('Password must be at least 6 characters', 400);

    const user = await registerUser({ name, email, password });
    res.status(201).json(user);
});

// Login controller
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) throw new AppError('Email and password are required', 400);
    if (!isValidEmail(email)) throw new AppError('Invalid email format', 400);

    const result = await loginUser({ email, password });
    res.json(result);
});

// Logut Controller
export const logout = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = req.user;

    await prisma.blacklistedToken.create({
        data: {
            token,
            expiresAt: new Date(decoded.exp * 1000),
        },
    });

    res.json({ message: 'Logged out successfully' });
});