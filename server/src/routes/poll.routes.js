import express from 'express';
import { createPoll, getPolls, votePoll, deletePoll } from '../controllers/poll.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getPolls);
router.post('/:id/vote', votePoll);
router.post('/', authorize('committee'), createPoll);
router.delete('/:id', authorize('committee'), deletePoll);

export default router;
