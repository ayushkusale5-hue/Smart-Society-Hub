import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadDocument } from '../middleware/upload.middleware.js';
import {
  createItem, getItems, updateItem, deleteItem,
} from '../controllers/lostfound.controller.js';

const router = Router();
router.use(authenticate);

router.post('/', uploadDocument, createItem);
router.get('/', getItems);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
