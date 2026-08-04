import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Theft', 'Vandalism', 'Trespassing', 'Fire', 'Flood', 'Noise', 'Suspicious Activity', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Investigating', 'Resolved', 'Closed'],
      default: 'Open',
    },
    location: {
      type: String,
      trim: true,
    },
    evidence: {
      type: [String],
      default: [],
    },
    reportedBy: {
      type: String, // SQLite user ID
      required: true,
      index: true,
    },
    reportedByName: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: String,
      default: null,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
    societyId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

incidentSchema.index({ status: 1, createdAt: -1 });

export const Incident = mongoose.model('Incident', incidentSchema);
