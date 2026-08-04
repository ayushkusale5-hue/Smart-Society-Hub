import mongoose from 'mongoose';

const vehicleLogSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Car', 'Bike', 'Auto', 'Truck', 'Other'],
      default: 'Car',
    },
    driverName: {
      type: String,
      trim: true,
    },
    purpose: {
      type: String,
      trim: true,
    },
    flatNumber: {
      type: String,
      trim: true,
    },
    entryTime: {
      type: Date,
      default: Date.now,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    loggedBy: {
      type: String, // SQLite user ID (security guard)
      required: true,
      index: true,
    },
    loggedByName: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    societyId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

vehicleLogSchema.index({ vehicleNumber: 1, entryTime: -1 });
vehicleLogSchema.index({ createdAt: -1 });

export const VehicleLog = mongoose.model('VehicleLog', vehicleLogSchema);
