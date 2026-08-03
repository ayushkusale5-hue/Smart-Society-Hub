import api from './api';

export const parkingService = {
  getParkingSlots: () => api.get('/parking'),
  assignSlot: (id, data) => api.patch(`/parking/${id}/assign`, data),
  updateMyVehicle: (id, vehicleNumber) => api.patch(`/parking/${id}/vehicle`, { vehicleNumber }),
};
