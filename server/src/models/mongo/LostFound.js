import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Lost', 'Found'],
    },
    category: {
      type: String,
      enum: ['Electronics', 'Keys', 'Wallet', 'Documents', 'Clothing', 'Pet', 'Other'],
      default: 'Other',
    },
    location: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    images: { type: [String], default: [] },
    contactPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Active', 'Claimed', 'Resolved'],
      default: 'Active',
    },
    reportedBy: { type: String, required: true, index: true },
    reportedByName: { type: String, trim: true },
    claimedBy: { type: String },
    claimedByName: { type: String },
    societyId: { type: String, index: true },
  },
  { timestamps: true }
);

lostFoundSchema.index({ type: 1, status: 1, createdAt: -1 });

export const LostFound = mongoose.model('LostFound', lostFoundSchema);
