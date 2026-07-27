import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    // Reference to the inviting resident (SQLite user ID)
    residentId: { type: String, required: true, index: true },
    societyId: { type: String, required: true, index: true },

    // Visitor details
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true },
    vehicleNumber: { type: String, trim: true },

    // QR pass
    qrCode: { type: String, unique: true, sparse: true },
    qrExpiry: { type: Date },

    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'entered', 'exited', 'expired'],
      default: 'pending',
    },

    // Timestamps
    expectedArrival: { type: Date },
    entryTime: { type: Date },
    exitTime: { type: Date },

    // Security
    approvedBy: { type: String }, // Security guard SQLite user ID
    entryGuardId: { type: String },
    exitGuardId: { type: String },

    // Pass type
    passType: { type: String, enum: ['single', 'recurring', 'temporary'], default: 'single' },

    // For recurring passes
    validFrom: { type: Date },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

visitorSchema.index({ residentId: 1, status: 1 });
visitorSchema.index({ qrCode: 1 });
visitorSchema.index({ societyId: 1, createdAt: -1 });

export default mongoose.model('Visitor', visitorSchema);
