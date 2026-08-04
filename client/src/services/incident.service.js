import api from './api';

export const incidentService = {
  create: (data) => api.post('/incidents', data),
  getAll: (params) => api.get('/incidents', { params }),
  update: (id, data) => api.patch(`/incidents/${id}`, data),
  remove: (id) => api.delete(`/incidents/${id}`),
};
