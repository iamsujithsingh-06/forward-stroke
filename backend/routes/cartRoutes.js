import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.patch('/:itemId', protect, updateCartItem);
router.delete('/clear', protect, clearCart);
router.delete('/:itemId', protect, removeCartItem);

export default router;
