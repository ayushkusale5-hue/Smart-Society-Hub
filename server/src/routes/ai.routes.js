import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { handleAssistantChat } from '../controllers/ai.controller.js';

const router = Router();
router.use(authenticate);

router.post('/chat', handleAssistantChat);

export default router;
