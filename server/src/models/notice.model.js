import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    createdBy: { type: String, required: true },
    societyId: { type: String, required: true, index: true },

    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['general', 'event', 'emergency', 'maintenance', 'payment', 'meeting'],
      default: 'general',
    },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    isPinned: { type: Boolean, default: false },
    attachments: [{ type: String }],
    expiresAt: { type: Date },
    viewedBy: [{ type: String }],
  },
  { timestamps: true }
);

noticeSchema.index({ societyId: 1, isPinned: -1, createdAt: -1 });

export default mongoose.model('Notice', noticeSchema);
