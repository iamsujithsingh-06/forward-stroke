import api from './api';

export const wishlistService = {
  get: () => api.get('/api/wishlist'),
  add: (productId) => api.post(`/api/wishlist/${productId}`),
  remove: (productId) => api.delete(`/api/wishlist/${productId}`),
};
