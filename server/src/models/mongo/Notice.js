import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['General', 'Emergency', 'Event', 'Maintenance'],
      default: 'General',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    authorId: {
      type: Number, // Reference to SQLite User ID (Committee Member)
      required: true,
    },
    attachments: {
      type: [String], // URLs to local storage documents/images
      default: [],
    },
  },
  { timestamps: true }
);

export const Notice = mongoose.model('Notice', noticeSchema);
