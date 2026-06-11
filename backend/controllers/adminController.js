import Product from '../models/Product.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';

// ========== DASHBOARD ==========
export const getDashboard = async (_req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalPosts, totalWishlists, totalCarts] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Post.countDocuments(),
      Wishlist.countDocuments(),
      Cart.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalPosts, totalWishlists, totalCarts },
    });
  } catch (err) {
    next(err);
  }
};

// ========== PRODUCT MANAGEMENT ==========
export const getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ success: true, products, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

export const createAdminProduct = async (req, res, next) => {
  try {
    const { name, slug, description, price, category, team, country, images, stock, rating, featured } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
    }
    const product = await Product.create({
      name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description: description || '', price, category,
      team: team || '', country: country || '', images: images || [], stock: stock || 0, rating: rating || 4.5,
      featured: featured || false, isActive: true,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const updateAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deactivated.' });
  } catch (err) {
    next(err);
  }
};

export const toggleFeaturedProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    product.featured = !product.featured;
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ========== USER MANAGEMENT ==========
export const getAdminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ success: true, users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

export const getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be user or admin.' });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ========== COMMUNITY MODERATION ==========
export const getAdminPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments();
    const posts = await Post.find().populate('author', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ success: true, posts, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    next(err);
  }
};

// ========== ANALYTICS ==========
export const getAnalytics = async (_req, res, next) => {
  try {
    const [wishlistAgg, cartAgg, postAgg] = await Promise.all([
      Wishlist.aggregate([
        { $unwind: '$products' },
        { $group: { _id: '$products', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Cart.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Post.aggregate([
        { $project: { likesCount: { $size: '$likes' }, content: 1, author: 1 } },
        { $sort: { likesCount: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const wishlistIds = wishlistAgg.map((e) => e._id);
    const cartIds = cartAgg.map((e) => e._id);

    const [mostWishlisted, mostCarted, mostLikedPosts] = await Promise.all([
      wishlistIds.length > 0 ? Product.find({ _id: { $in: wishlistIds } }).lean() : [],
      cartIds.length > 0 ? Product.find({ _id: { $in: cartIds } }).lean() : [],
      Post.find({ _id: { $in: postAgg.map((p) => p._id) } }).populate('author', 'name').lean(),
    ]);

    const teamAgg = await Product.aggregate([
      { $match: { team: { $ne: '' }, isActive: true } },
      { $group: { _id: '$team', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Most liked posts data
    const likedPostsData = mostLikedPosts.map((p) => ({
      _id: p._id,
      content: p.content?.substring(0, 100),
      author: p.author,
      likesCount: postAgg.find((pa) => pa._id.toString() === p._id.toString())?.likesCount || 0,
    }));

    res.json({
      success: true,
      analytics: {
        mostWishlisted,
        mostCarted,
        mostLikedPosts: likedPostsData,
        trendingTeams: teamAgg.filter((t) => t._id),
      },
    });
  } catch (err) {
    next(err);
  }
};
