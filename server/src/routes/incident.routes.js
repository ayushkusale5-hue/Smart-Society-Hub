import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { uploadIncidentEvidence } from '../middleware/upload.middleware.js';
import {
  createIncident,
  getIncidents,
  updateIncident,
  deleteIncident,
} from '../controllers/incident.controller.js';

const router = Router();

router.use(authenticate);

// Security/Committee can create incidents
router.post('/', authorize('security', 'committee'), uploadIncidentEvidence, createIncident);

// Get incidents
router.get('/', getIncidents);

// Update incident status
router.patch('/:id', authorize('security', 'committee'), updateIncident);

// Delete incident
router.delete('/:id', authorize('security', 'committee'), deleteIncident);

export default router;
