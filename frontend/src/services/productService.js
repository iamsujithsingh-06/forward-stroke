import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getRelated: (slug) => api.get(`/products/${slug}/related`),
  getFeatured: () => api.get('/products/featured'),
  getFilters: () => api.get('/products/filters'),
};