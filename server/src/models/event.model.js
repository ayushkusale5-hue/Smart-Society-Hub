import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    createdBy: { type: String, required: true },
    societyId: { type: String, required: true, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['cultural', 'sports', 'meeting', 'celebration', 'workshop', 'other'], default: 'other' },

    venue: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },

    maxCapacity: { type: Number },
    registrationDeadline: { type: Date },

    coverImage: { type: String },
    photos: [{ type: String }],

    isRSVPRequired: { type: Boolean, default: false },
    rsvps: [
      {
        userId: { type: String },
        status: { type: String, enum: ['attending', 'not_attending', 'maybe'] },
        respondedAt: { type: Date, default: Date.now },
      },
    ],

    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  },
  { timestamps: true }
);

eventSchema.index({ societyId: 1, startDateTime: 1, status: 1 });

export default mongoose.model('Event', eventSchema);
