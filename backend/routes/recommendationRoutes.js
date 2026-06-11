import { Router } from 'express';
import { getTrending, getRelated, getPersonalized, getFansAlsoLiked } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/trending', getTrending);
router.get('/related/:productId', getRelated);
router.get('/personalized', protect, getPersonalized);
router.get('/fans-also-liked', getFansAlsoLiked);

export default router;
