import api from './api';

export const pollService = {
  getPolls: () => api.get('/polls'),
  createPoll: (data) => api.post('/polls', data),
  votePoll: (id, optionIds) => api.post(`/polls/${id}/vote`, { optionIds }),
  deletePoll: (id) => api.delete(`/polls/${id}`)
};
