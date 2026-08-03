import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadComplaintImages } from '../middleware/upload.middleware.js';
import {
  createComplaint,
  getComplaints,
  updateStatus,
  assignComplaint,
  deleteComplaint
} from '../controllers/complaint.controller.js';

const router = Router();


router.use(authenticate);


router.post('/', uploadComplaintImages, createComplaint);


router.get('/', getComplaints);


router.patch('/:id/status', updateStatus);


router.patch('/:id/assign', assignComplaint);


router.delete('/:id', deleteComplaint);

export default router;
