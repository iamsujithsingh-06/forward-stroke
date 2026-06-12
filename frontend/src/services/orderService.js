import api from './api';

export const orderService = {
  getOrders: () => api.get('/api/orders'),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  createOrder: (items) => api.post('/api/orders', { items }),
};
