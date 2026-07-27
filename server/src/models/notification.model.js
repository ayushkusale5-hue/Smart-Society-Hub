import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
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
      required: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    referenceId: { type: String }, // ID of related entity
    referenceModel: { type: String }, // e.g. 'Complaint', 'Visitor'
    link: { type: String }, // Frontend route to navigate to
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
