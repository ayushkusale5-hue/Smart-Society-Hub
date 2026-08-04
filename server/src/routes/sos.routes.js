import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import {
  triggerSos,
  acknowledgeAlert,
  resolveAlert,
  getAlerts,
} from '../controllers/sos.controller.js';

const router = Router();

router.use(authenticate);

// Any authenticated user can trigger SOS
router.post('/', triggerSos);

// Get all alerts (any authenticated user can see)
router.get('/', getAlerts);

// Security/Committee can acknowledge
router.patch('/:id/acknowledge', authorize('security', 'committee'), acknowledgeAlert);

// Security/Committee can resolve
router.patch('/:id/resolve', authorize('security', 'committee'), resolveAlert);

export default router;
