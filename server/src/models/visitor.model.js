import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    
    residentId: { type: String, required: true, index: true },
    societyId: { type: String, required: true, index: true },

    
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true },
    vehicleNumber: { type: String, trim: true },

    
    qrCode: { type: String, unique: true, sparse: true },
    qrExpiry: { type: Date },

    
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'entered', 'exited', 'expired'],
      default: 'pending',
    },

    
    expectedArrival: { type: Date },
    entryTime: { type: Date },
    exitTime: { type: Date },

    
    approvedBy: { type: String }, 
    entryGuardId: { type: String },
    exitGuardId: { type: String },

    
    passType: { type: String, enum: ['single', 'recurring', 'temporary'], default: 'single' },

    
    validFrom: { type: Date },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

visitorSchema.index({ residentId: 1, status: 1 });
visitorSchema.index({ qrCode: 1 });
visitorSchema.index({ societyId: 1, createdAt: -1 });

export default mongoose.model('Visitor', visitorSchema);
