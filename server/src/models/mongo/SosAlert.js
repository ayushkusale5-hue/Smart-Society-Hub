import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema(
  {
    triggeredBy: {
      type: String, // SQLite user ID
      required: true,
      index: true,
    },
    triggeredByName: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Medical', 'Fire', 'Security', 'Natural Disaster', 'Other'],
      default: 'Other',
    },
    message: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Acknowledged', 'Resolved'],
      default: 'Active',
    },
    acknowledgedBy: { type: String },
    acknowledgedByName: { type: String },
    acknowledgedAt: { type: Date },
    resolvedBy: { type: String },
    resolvedByName: { type: String },
    resolvedAt: { type: Date },
    resolutionNotes: { type: String, trim: true },
    societyId: { type: String, index: true },
  },
  { timestamps: true }
);

sosAlertSchema.index({ status: 1, createdAt: -1 });

export const SosAlert = mongoose.model('SosAlert', sosAlertSchema);
