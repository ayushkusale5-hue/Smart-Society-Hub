import api from './api';

export const vehicleService = {
  logEntry: (data) => api.post('/vehicles/entry', data),
  logExit: (id) => api.patch(`/vehicles/${id}/exit`),
  getLogs: (params) => api.get('/vehicles', { params }),
};
