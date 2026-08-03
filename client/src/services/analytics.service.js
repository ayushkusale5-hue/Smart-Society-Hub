import api from './api';

export const analyticsService = {
  getCommitteeAnalytics: () => api.get('/analytics/committee'),
};
