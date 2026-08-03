import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    residentId: {
      type: String, 
      required: true,
      index: true,
    },
    month: {
      type: String, 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['Maintenance', 'Penalty', 'Other'],
      default: 'Maintenance',
    },
    paidAt: {
      type: Date,
    },
    transactionId: {
      type: String,
    }
  },
  { timestamps: true }
);

billSchema.index({ residentId: 1, month: 1 }, { unique: true });

export const Bill = mongoose.model('Bill', billSchema);
