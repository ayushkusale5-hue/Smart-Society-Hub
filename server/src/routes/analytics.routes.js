import express from 'express';
import { getCommitteeAnalytics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = express.Router();


router.use(authenticate);

router.get('/committee', authorize('committee'), getCommitteeAnalytics);

export default router;
