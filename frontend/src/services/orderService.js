import api from './api';

export const orderService = {
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (items) => api.post('/orders', { items }),
};
