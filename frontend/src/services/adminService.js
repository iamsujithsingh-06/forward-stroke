import api from './api';

export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getAnalytics: () => api.get('/api/admin/analytics'),
  getProducts: (params) => api.get('/api/admin/products', { params }),
  createProduct: (data) => api.post('/api/admin/products', data),
  updateProduct: (id, data) => api.put(`/api/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/admin/products/${id}`),
  toggleFeatured: (id) => api.patch(`/api/admin/products/${id}/featured`),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  changeUserRole: (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }),
  getPosts: (params) => api.get('/api/admin/posts', { params }),
  deletePost: (id) => api.delete(`/api/admin/posts/${id}`),
};
