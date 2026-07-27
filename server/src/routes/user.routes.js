import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  changePassword,
  toggleUserActive,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize, isSelfOrCommittee } from '../middleware/rbac.middleware.js';
import { uploadAvatar } from '../middleware/upload.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', authorize('committee'), getAllUsers);
router.get('/:id', isSelfOrCommittee, getUserById);
router.patch('/profile', updateProfile);
router.patch('/avatar', uploadAvatar, updateAvatar);
router.patch('/change-password', changePassword);
router.patch('/:id/toggle-active', authorize('committee'), toggleUserActive);

export default router;
