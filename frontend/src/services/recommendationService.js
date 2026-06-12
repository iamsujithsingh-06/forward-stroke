import api from './api';

export const recommendationService = {
  getTrending: () => api.get('/recommendations/trending'),
  getRelated: (productId) => api.get(`/recommendations/related/${productId}`),
  getPersonalized: () => api.get('/recommendations/personalized'),
  getFansAlsoLiked: () => api.get('/recommendations/fans-also-liked'),
};
