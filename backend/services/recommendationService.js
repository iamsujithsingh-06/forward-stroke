import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';

export async function getProductMetrics() {
  const [wishlistAgg, cartAgg] = await Promise.all([
    Wishlist.aggregate([
      { $unwind: '$products' },
      { $group: { _id: '$products', count: { $sum: 1 } } },
    ]),
    Cart.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
    ]),
  ]);

  const wishlistMap = {};
  const cartMap = {};
  for (const entry of wishlistAgg) wishlistMap[entry._id.toString()] = entry.count;
  for (const entry of cartAgg) cartMap[entry._id.toString()] = entry.count;

  return { wishlistMap, cartMap };
}

export async function calculateTrendingScore(product, wishlistCount = 0, cartCount = 0) {
  const wl = wishlistCount * 3;
  const cc = cartCount * 5;
  const rt = (product.rating || 4.5) * 10;
  return wl + cc + rt;
}

export async function getRelatedProducts(productId, limit = 4) {
  const product = await Product.findById(productId);
  if (!product) return { similarTeam: [], similarCountry: [], similarCategory: [] };

  const [similarTeam, similarCountry, similarCategory] = await Promise.all([
    product.team
      ? Product.find({
          _id: { $ne: productId },
          isActive: true,
          team: product.team,
        })
          .sort({ rating: -1 })
          .limit(limit)
      : [],
    product.country
      ? Product.find({
          _id: { $ne: productId },
          isActive: true,
          country: product.country,
        })
          .sort({ rating: -1 })
          .limit(limit)
      : [],
    Product.find({
      _id: { $ne: productId },
      isActive: true,
      category: product.category,
    })
      .sort({ rating: -1 })
      .limit(limit),
  ]);

  return { similarTeam, similarCountry, similarCategory };
}

export async function getTrendingProducts(limit = 10) {
  const { wishlistMap, cartMap } = await getProductMetrics();
  const products = await Product.find({ isActive: true }).lean();

  const scored = products.map((p) => {
    const id = p._id.toString();
    const wl = wishlistMap[id] || 0;
    const cc = cartMap[id] || 0;
    const score = wl * 3 + cc * 5 + (p.rating || 4.5) * 10;
    return { ...p, trendingScore: Math.round(score * 10) / 10, wishlistCount: wl, cartCount: cc };
  });

  return scored.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit);
}

export async function getRecommendedProducts(userId, limit = 8) {
  const [wishlist, cart] = await Promise.all([
    Wishlist.findOne({ user: userId }).populate('products'),
    Cart.findOne({ user: userId }).populate('items.product'),
  ]);

  const preferences = { teams: new Set(), countries: new Set(), categories: new Set(), productIds: new Set() };

  for (const p of wishlist?.products || []) {
    if (p.team) preferences.teams.add(p.team);
    if (p.country) preferences.countries.add(p.country);
    preferences.categories.add(p.category);
    preferences.productIds.add(p._id.toString());
  }

  for (const item of cart?.items || []) {
    const p = item.product;
    if (p) {
      if (p.team) preferences.teams.add(p.team);
      if (p.country) preferences.countries.add(p.country);
      preferences.categories.add(p.category);
      preferences.productIds.add(p._id.toString());
    }
  }

  if (preferences.teams.size === 0 && preferences.countries.size === 0 && preferences.categories.size === 0) {
    return [];
  }

  const matchConditions = [];
  if (preferences.teams.size > 0) matchConditions.push({ team: { $in: [...preferences.teams] } });
  if (preferences.countries.size > 0) matchConditions.push({ country: { $in: [...preferences.countries] } });
  if (preferences.categories.size > 0) matchConditions.push({ category: { $in: [...preferences.categories] } });

  const recommended = await Product.find({
    _id: { $nin: [...preferences.productIds] },
    isActive: true,
    $or: matchConditions,
  })
    .sort({ rating: -1 })
    .limit(limit);

  return recommended;
}

export async function getFansAlsoLiked(limit = 8) {
  const { wishlistMap, cartMap } = await getProductMetrics();
  const products = await Product.find({ isActive: true }).lean();

  const scored = products.map((p) => {
    const id = p._id.toString();
    const wl = wishlistMap[id] || 0;
    const cc = cartMap[id] || 0;
    const score = wl * 2 + cc * 4 + (p.rating || 4.5) * 5;
    return { ...p, fanScore: Math.round(score * 10) / 10, wishlistCount: wl, cartCount: cc };
  });

  return scored.sort((a, b) => b.fanScore - a.fanScore).slice(0, limit);
}
