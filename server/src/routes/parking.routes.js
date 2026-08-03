import express from 'express';
import { getParkingSlots, assignSlot, updateMyVehicle } from '../controllers/parking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getParkingSlots);
router.patch('/:id/assign', authorize('committee'), assignSlot);
router.patch('/:id/vehicle', authorize('resident'), updateMyVehicle);

export default router;
