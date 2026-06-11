import Product from '../models/Product.js';
import { slugify } from '../utils/helpers.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      team,
      country,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (team) filter.team = team;
    if (country) filter.country = country;

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [
        { category: product.category },
        { team: product.team },
        { country: product.country },
      ],
    })
      .limit(5)
      .sort({ rating: -1 });

    res.json({ success: true, products: related });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (_req, res, next) => {
  try {
    const products = await Product.find({ featured: true, isActive: true }).limit(8);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

export const getFilterOptions = async (_req, res, next) => {
  try {
    const [categories, teams, countries] = await Promise.all([
      Product.distinct('category', { isActive: true }),
      Product.distinct('team', { isActive: true }),
      Product.distinct('country', { isActive: true }),
    ]);

    res.json({
      success: true,
      filters: {
        categories: categories.filter(Boolean).sort(),
        teams: teams.filter(Boolean).sort(),
        countries: countries.filter(Boolean).sort(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};
