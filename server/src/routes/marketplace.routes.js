import express from 'express';
import { getListings, createListing, expressInterest, updateListing, deleteListing } from '../controllers/marketplace.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getListings);
router.post('/', createListing);
router.post('/:id/interest', expressInterest);
router.patch('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;
