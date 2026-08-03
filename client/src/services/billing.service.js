import api from './api';

export const billingService = {
  getBills: (params) => api.get('/billing', { params }),
  generateBulkBills: (data) => api.post('/billing/generate', data),
  payBill: (id, transactionId) => api.post(`/billing/${id}/pay`, { transactionId }),
  deleteBill: (id) => api.delete(`/billing/${id}`),
};
