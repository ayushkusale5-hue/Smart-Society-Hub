import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import {
  logVehicleEntry,
  logVehicleExit,
  getVehicleLogs,
} from '../controllers/vehicle.controller.js';

const router = Router();

router.use(authenticate);

// Security logs vehicle entry
router.post('/entry', authorize('security', 'committee'), logVehicleEntry);

// Security logs vehicle exit
router.patch('/:id/exit', authorize('security', 'committee'), logVehicleExit);

// Get vehicle logs
router.get('/', getVehicleLogs);

export default router;
