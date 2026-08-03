import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
  togglePin,
} from '../controllers/notice.controller.js';

const router = Router();
router.use(authenticate);

router.post('/', createNotice);
router.get('/', getNotices);
router.patch('/:id', updateNotice);
router.delete('/:id', deleteNotice);
router.patch('/:id/pin', togglePin);

export default router;
