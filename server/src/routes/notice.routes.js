import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
  togglePin,
  generateNoticeDraft,
} from '../controllers/notice.controller.js';

const router = Router();
router.use(authenticate);

router.post('/generate', generateNoticeDraft);
router.post('/', createNotice);
router.get('/', getNotices);
router.patch('/:id', updateNotice);
router.delete('/:id', deleteNotice);
router.patch('/:id/pin', togglePin);

export default router;
