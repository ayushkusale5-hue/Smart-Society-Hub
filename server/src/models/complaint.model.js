import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: String, required: true, index: true }, 
    societyId: { type: String, required: true, index: true },
    flatNumber: { type: String },
    tower: { type: String },

    
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

    
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed', 'rejected'],
      default: 'open',
      index: true,
    },

    
    images: [{ type: String }], 

    
    assignedTo: { type: String }, 
    assignedAt: { type: Date },

    
    resolvedAt: { type: Date },
    resolutionNote: { type: String },
    completionImages: [{ type: String }],

    
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      submittedAt: { type: Date },
    },

    
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
