import Order from '../models/Order.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Add items before placing an order.' });
    }

    const orderItems = items.map((item) => {
      const product = item.product || {};
      return {
        product: product._id,
        name: product.name || 'Unknown Product',
        price: product.price || 0,
        quantity: item.quantity || 1,
        image: (product.images && product.images[0]) || '',
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      total: subtotal,
      orderStatus: 'pending',
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
