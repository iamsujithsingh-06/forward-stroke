import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
