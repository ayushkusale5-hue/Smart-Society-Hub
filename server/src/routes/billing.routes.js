import express from 'express';
import { generateBulkBills, getBills, payBill, deleteBill } from '../controllers/billing.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getBills);
router.post('/generate', authorize('committee'), generateBulkBills);
router.post('/:id/pay', authorize('resident'), payBill);
router.delete('/:id', authorize('committee'), deleteBill);

export default router;
