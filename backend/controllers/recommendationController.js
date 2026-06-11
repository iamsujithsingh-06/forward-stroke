import Product from '../models/Product.js';
import * as recService from '../services/recommendationService.js';

export const getTrending = async (_req, res, next) => {
  try {
    const products = await recService.getTrendingProducts(10);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

export const getRelated = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const related = await recService.getRelatedProducts(req.params.productId, 4);
    res.json({ success: true, related });
  } catch (err) {
    next(err);
  }
};

export const getPersonalized = async (req, res, next) => {
  try {
    const products = await recService.getRecommendedProducts(req.user._id, 8);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

export const getFansAlsoLiked = async (_req, res, next) => {
  try {
    const products = await recService.getFansAlsoLiked(8);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};
