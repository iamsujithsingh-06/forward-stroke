import api from './api';

export const productService = {
  getAll: (params) => api.get('/api/products', { params }),
  getBySlug: (slug) => api.get(`/api/products/${slug}`),
  getRelated: (slug) => api.get(`/api/products/${slug}/related`),
  getFeatured: () => api.get('/api/products/featured'),
  getFilters: () => api.get('/api/products/filters'),
};
