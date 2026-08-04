import api from './api';

export const eventService = {
  create: (data) => api.post('/events', data),
  getAll: (params) => api.get('/events', { params }),
  getOne: (id) => api.get(`/events/${id}`),
  update: (id, data) => api.patch(`/events/${id}`, data),
  remove: (id) => api.delete(`/events/${id}`),
  rsvp: (id, data) => api.post(`/events/${id}/rsvp`, data),
};
