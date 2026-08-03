import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema(
  {
    societyId: { type: String, required: true, index: true },
    slotNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['car', 'bike'], required: true },
    isGuest: { type: Boolean, default: false },
    assignedTo: { type: String, index: true }, 
    vehicleNumber: { type: String }, 
    status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' }
  },
  { timestamps: true }
);

export const Parking = mongoose.model('Parking', parkingSchema);
