import api from './api';

export const analyticsService = {
  getCommitteeAnalytics: () => api.get('/analytics/committee'),
  getFullAnalytics: () => api.get('/analytics/full'),
};
