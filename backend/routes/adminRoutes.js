import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
  getDashboard,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleFeaturedProduct,
  getAdminUsers,
  getAdminUserById,
  changeUserRole,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminPosts,
  deleteAdminPost,
  getAnalytics,
} from '../controllers/adminController.js';

const router = Router();

router.use(protect, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);
router.patch('/products/:id/featured', toggleFeaturedProduct);
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateAdminOrderStatus);
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.patch('/users/:id/role', changeUserRole);
router.get('/posts', getAdminPosts);
router.delete('/posts/:id', deleteAdminPost);

export default router;
