import api from './api';

export const cartService = {
  get: () => api.get('/api/cart'),
  add: (productId, quantity = 1) => api.post('/api/cart', { productId, quantity }),
  updateQuantity: (itemId, quantity) => api.patch(`/api/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/api/cart/${itemId}`),
  clear: () => api.delete('/api/cart/clear'),
};
