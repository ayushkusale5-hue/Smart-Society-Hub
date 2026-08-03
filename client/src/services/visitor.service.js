import api from './api';

export const visitorService = {
  
  inviteVisitor: (data) => api.post('/visitors', data),

  
  getMyVisitors: (params = {}) => api.get('/visitors/my', { params }),

  
  getAllVisitors: (params = {}) => api.get('/visitors/all', { params }),

  
  getExpectedVisitors: () => api.get('/visitors/expected'),

  
  scanQR: (qrCode) => api.get(`/visitors/qr/${qrCode}`),

  
  markEntry: (id) => api.patch(`/visitors/${id}/entry`),

  
  markExit: (id) => api.patch(`/visitors/${id}/exit`),
  denyVisitor: (id) => api.patch(`/visitors/${id}/deny`),
  deleteVisitor: (id) => api.delete(`/visitors/${id}`)
};
