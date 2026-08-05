import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: [
        (opts) => opts.length >= 2,
        "A poll must have at least 2 options",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    votedUsers: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Poll = mongoose.model("Poll", pollSchema);
