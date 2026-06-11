import { Router } from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  getFeaturedProducts,
  getFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/filters', getFilterOptions);
router.get('/featured', getFeaturedProducts);
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
