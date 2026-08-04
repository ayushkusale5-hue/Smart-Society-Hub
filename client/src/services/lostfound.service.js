import api from './api';

export const lostFoundService = {
  create: (data) => api.post('/lost-found', data),
  getAll: (params) => api.get('/lost-found', { params }),
  update: (id, data) => api.patch(`/lost-found/${id}`, data),
  remove: (id) => api.delete(`/lost-found/${id}`),
};
