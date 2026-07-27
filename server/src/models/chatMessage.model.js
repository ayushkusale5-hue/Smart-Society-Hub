import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    societyId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String },
    senderAvatar: { type: String },

    message: { type: String, trim: true },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    attachmentUrl: { type: String },

    isDeleted: { type: Boolean, default: false },
    readBy: [{ type: String }],
  },
  { timestamps: true }
);

chatMessageSchema.index({ societyId: 1, createdAt: -1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
