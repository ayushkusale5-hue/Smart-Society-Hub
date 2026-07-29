import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadComplaintImages } from '../middleware/upload.middleware.js';
import {
  createComplaint,
  getComplaints,
  updateStatus,
  assignComplaint
} from '../controllers/complaint.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create a new complaint (with up to 5 images)
router.post('/', uploadComplaintImages, createComplaint);

// Get complaints (automatically filtered by role in controller)
router.get('/', getComplaints);

// Update status (Maintenance or Committee)
router.patch('/:id/status', updateStatus);

// Assign complaint (Committee only)
router.patch('/:id/assign', assignComplaint);

export default router;
