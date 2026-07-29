import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ['Guest', 'Delivery', 'Service', 'Other'],
    },
    vehicleNumber: {
      type: String,
      trim: true,
    },
    expectedArrival: {
      type: Date,
    },
    actualEntry: {
      type: Date,
    },
    actualExit: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['Expected', 'Inside', 'Exited', 'Denied'],
      default: 'Expected',
    },
    qrCode: {
      type: String, // Unique identifier/hash for QR generation
      unique: true,
    },
    hostId: {
      type: Number, // Reference to SQLite User ID (Resident)
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Visitor = mongoose.model('Visitor', visitorSchema);
