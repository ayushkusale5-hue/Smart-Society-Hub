import express from 'express';
import { getFacilities, bookFacility, getBookings, updateBookingStatus, deleteBooking } from '../controllers/facility.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFacilities);
router.get('/bookings', getBookings);
router.post('/book', bookFacility);
router.patch('/bookings/:id/status', authorize('committee'), updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

export default router;
