import api from './api';

export const recommendationService = {
  getTrending: () => api.get('/api/recommendations/trending'),
  getRelated: (productId) => api.get(`/api/recommendations/related/${productId}`),
  getPersonalized: () => api.get('/api/recommendations/personalized'),
  getFansAlsoLiked: () => api.get('/api/recommendations/fans-also-liked'),
};
