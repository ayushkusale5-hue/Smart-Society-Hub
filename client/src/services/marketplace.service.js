import api from './api';

export const marketplaceService = {
  getListings: (params) => api.get('/marketplace', { params }),
  createListing: (data) => api.post('/marketplace', data),
  updateListing: (id, data) => api.patch(`/marketplace/${id}`, data),
  deleteListing: (id) => api.delete(`/marketplace/${id}`),
  expressInterest: (id) => api.post(`/marketplace/${id}/interest`),
};
