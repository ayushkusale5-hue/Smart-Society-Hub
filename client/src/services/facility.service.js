import api from './api';

export const facilityService = {
  getFacilities: () => api.get('/facilities'),
  getBookings: (params) => api.get('/facilities/bookings', { params }),
  bookFacility: (data) => api.post('/facilities/book', data),
  updateBookingStatus: (id, status) => api.patch(`/facilities/bookings/${id}/status`, { status }),
  deleteBooking: (id) => api.delete(`/facilities/bookings/${id}`)
};
