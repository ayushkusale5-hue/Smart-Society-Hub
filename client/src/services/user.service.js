import api from './api';

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.patch('/users/profile', data),
  updateAvatar: (formData) => api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.patch('/users/change-password', data),
  toggleUserActive: (id, isActive) => api.patch(`/users/${id}/toggle-active`, { isActive })
};
