import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    purpose: {
      type: String,
      required: true,
      enum: ['Guest', 'Delivery', 'Service', 'Other'],
    },
    vehicleNumber: { type: String, trim: true },
    expectedArrival: { type: Date },
    actualEntry: { type: Date },
    actualExit: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ['Expected', 'Inside', 'Exited', 'Denied'],
      default: 'Expected',
    },
    passType: {
      type: String,
      enum: ['single', 'recurring', 'temporary'],
      default: 'single',
    },
    validFrom: { type: Date },
    validUntil: { type: Date },
    qrCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    hostId: {
      type: String, 
      required: true,
      index: true,
    },
    societyId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

visitorSchema.index({ hostId: 1, status: 1 });
visitorSchema.index({ societyId: 1, createdAt: -1 });

export const Visitor = mongoose.model('Visitor', visitorSchema);
