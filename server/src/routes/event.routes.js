import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import {
  createEvent, getEvents, getEvent, updateEvent, deleteEvent, rsvpEvent,
} from '../controllers/event.controller.js';

const router = Router();
router.use(authenticate);

router.post('/', authorize('committee'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.patch('/:id', authorize('committee'), updateEvent);
router.delete('/:id', authorize('committee'), deleteEvent);
router.post('/:id/rsvp', rsvpEvent);

export default router;
