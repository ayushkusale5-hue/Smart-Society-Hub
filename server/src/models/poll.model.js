import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema(
  {
    createdBy: { type: String, required: true },
    societyId: { type: String, required: true, index: true },

    question: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['poll', 'survey', 'election'], default: 'poll' },
    isAnonymous: { type: Boolean, default: false },
    isMultipleChoice: { type: Boolean, default: false },

    options: [
      {
        text: { type: String, required: true },
        votes: [{ type: String }], // Array of voter user IDs
      },
    ],

    status: { type: String, enum: ['draft', 'active', 'closed'], default: 'active' },
    endsAt: { type: Date },
    totalVoters: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pollSchema.index({ societyId: 1, status: 1, createdAt: -1 });

export default mongoose.model('Poll', pollSchema);
