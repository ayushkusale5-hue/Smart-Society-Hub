import api from './api';

export const sosService = {
  trigger: (data) => api.post('/sos', data),
  getAlerts: (params) => api.get('/sos', { params }),
  acknowledge: (id) => api.patch(`/sos/${id}/acknowledge`),
  resolve: (id, data) => api.patch(`/sos/${id}/resolve`, data),
};
