import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: String, required: true, index: true }, // SQLite user ID
    societyId: { type: String, required: true, index: true },
    flatNumber: { type: String },
    tower: { type: String },

    // Complaint details
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['plumbing', 'electrical', 'civil', 'housekeeping', 'lift', 'security', 'internet', 'parking', 'common_area', 'other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Status tracking
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'],
      default: 'open',
      index: true,
    },

    // Images
    images: [{ type: String }], // Cloudinary URLs

    // Assignment
    assignedTo: { type: String }, // Maintenance staff SQLite user ID
    assignedAt: { type: Date },

    // Resolution
    resolvedAt: { type: Date },
    resolutionNote: { type: String },
    completionImages: [{ type: String }],

    // Feedback
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      submittedAt: { type: Date },
    },

    // Status history
    statusHistory: [
      {
        status: { type: String },
        changedBy: { type: String },
        note: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

complaintSchema.index({ societyId: 1, status: 1, createdAt: -1 });
complaintSchema.index({ raisedBy: 1, status: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model('Complaint', complaintSchema);
