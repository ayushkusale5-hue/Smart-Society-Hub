import api from './api';

export const complaintService = {
  createComplaint: async (formData) => {
    
    return api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getComplaints: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    
    return api.get(`/complaints?${params.toString()}`);
  },

  updateStatus: async (id, status, resolutionNotes = '') => {
    return api.patch(`/complaints/${id}/status`, { status, resolutionNotes });
  },

  assignComplaint: async (id, assignedTo) => {
    return api.patch(`/complaints/${id}/assign`, { assignedTo });
  },

  deleteComplaint: async (id) => {
    return api.delete(`/complaints/${id}`);
  },
};
