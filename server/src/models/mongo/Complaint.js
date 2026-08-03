import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
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
      enum: ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Security', 'Other'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    images: {
      type: [String],
      default: [],
    },
    residentId: {
      type: String, 
      required: true,
      index: true,
    },
    assignedTo: {
      type: String, 
      default: null,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
