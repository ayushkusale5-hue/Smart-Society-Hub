import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    time: { type: String, trim: true },
    venue: { type: String, trim: true },
    category: {
      type: String,
      enum: ['Festival', 'Meeting', 'Sports', 'Cultural', 'Maintenance', 'General', 'Other'],
      default: 'General',
    },
    organizer: { type: String, trim: true },
    createdBy: { type: String, required: true, index: true },
    createdByName: { type: String, trim: true },
    maxAttendees: { type: Number, default: 0 },
    rsvps: [
      {
        userId: String,
        userName: String,
        status: { type: String, enum: ['Going', 'Maybe', 'Not Going'], default: 'Going' },
        rsvpAt: { type: Date, default: Date.now },
      },
    ],
    isPinned: { type: Boolean, default: false },
    societyId: { type: String, index: true },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });

export const Event = mongoose.model('Event', eventSchema);
