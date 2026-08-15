import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

import { create, getAll, getOne, update, remove } from '../controllers/notesController.js';

const router = express.Router();

router.use(protect);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
