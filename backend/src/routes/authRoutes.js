import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, (req, res) => {
    res.json({ user: req.user });
});

export default router;