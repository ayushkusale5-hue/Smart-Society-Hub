import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  inviteVisitor,
  getMyVisitors,
  getAllVisitors,
  getExpectedVisitors,
  scanQR,
  markEntry,
  markExit,
  denyVisitor,
  deleteVisitor
} from '../controllers/visitor.controller.js';

const router = Router();
router.use(authenticate);


router.post('/', inviteVisitor);
router.delete('/:id', deleteVisitor);


router.get('/my', getMyVisitors);


router.get('/all', getAllVisitors);


router.get('/expected', getExpectedVisitors);


router.get('/qr/:qrCode', scanQR);


router.patch('/:id/entry', markEntry);
router.patch('/:id/exit', markExit);
router.patch('/:id/deny', denyVisitor);

export default router;
