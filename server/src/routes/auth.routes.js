import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  googleLogin,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth
router.post('/google', googleLogin);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
