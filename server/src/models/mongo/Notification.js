import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: Number, // Reference to SQLite User ID
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Visitor', 'Complaint', 'General', 'System', 'Billing'],
      default: 'General',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional URL to redirect when clicked
      default: null,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
