import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['general', 'emergency', 'event', 'maintenance', 'payment', 'meeting'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    isPinned: { type: Boolean, default: false },
    createdBy: {
      type: String, 
      required: true,
    },
    societyId: { type: String, index: true },
    attachments: { type: [String], default: [] },
    expiresAt: { type: Date, default: null },
    viewedBy: { type: [String], default: [] },
  },
  { timestamps: true }
);

noticeSchema.index({ societyId: 1, isPinned: -1, createdAt: -1 });

export const Notice = mongoose.model('Notice', noticeSchema);
