import api from './api';

export const noticeService = {
  
  getNotices: (params = {}) => api.get('/notices', { params }),

  
  createNotice: (data) => api.post('/notices', data),

  
  updateNotice: (id, data) => api.patch(`/notices/${id}`, data),

  
  deleteNotice: (id) => api.delete(`/notices/${id}`),

  
  togglePin: (id) => api.patch(`/notices/${id}/pin`),

  // Generate notice draft via AI
  generateNoticeDraft: (prompt) => api.post('/notices/generate', { prompt }),
};
