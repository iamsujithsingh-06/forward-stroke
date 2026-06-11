import { Router } from 'express';
import { seedDatabase } from '../controllers/seedController.js';

const router = Router();

router.post('/seed', seedDatabase);

export default router;
