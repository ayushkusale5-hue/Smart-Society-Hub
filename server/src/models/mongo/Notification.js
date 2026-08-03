import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String, 
      required: true,
      index: true,
    },
    societyId: { type: String, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'visitor_arrived', 'visitor_approved', 'visitor_rejected',
        'complaint_update', 'complaint_assigned',
        'bill_due', 'bill_paid',
        'notice_posted', 'poll_created', 'poll_ended',
        'event_reminder', 'booking_approved', 'booking_rejected',
        'sos_alert', 'security_incident',
        'maintenance_update',
        'marketplace_interest',
        'system',
      ],
      default: 'system',
    },
    isRead: { type: Boolean, default: false, index: true },
    referenceId: { type: String },
    referenceModel: { type: String },
    link: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export { Notification };
export default Notification;
