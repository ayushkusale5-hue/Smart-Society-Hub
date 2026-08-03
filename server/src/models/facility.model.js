import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    societyId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['clubhouse', 'gym', 'swimming_pool', 'hall', 'tennis_court', 'badminton_court', 'other'],
      required: true,
    },
    description: { type: String },
    images: [{ type: String }],
    capacity: { type: Number },
    pricePerHour: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
    rules: [{ type: String }],
    advanceBookingDays: { type: Number, default: 7 },
    requiresApproval: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    bookedBy: { type: String, required: true, index: true },
    societyId: { type: String, required: true, index: true },

    date: { type: Date, required: true },
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true },
    duration: { type: Number }, 

    purpose: { type: String },
    attendees: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    approvedBy: { type: String },
    rejectionReason: { type: String },

    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded', 'waived'], default: 'pending' },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookingSchema.index({ facilityId: 1, date: 1 });
bookingSchema.index({ bookedBy: 1, status: 1 });

export const Facility = mongoose.model('Facility', facilitySchema);
export const Booking = mongoose.model('Booking', bookingSchema);
