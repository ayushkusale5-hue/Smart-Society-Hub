import mongoose from 'mongoose';

const marketplaceSchema = new mongoose.Schema(
  {
    sellerId: { type: String, required: true, index: true },
    societyId: { type: String, required: true, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    isNegotiable: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },

    category: {
      type: String,
      enum: ['furniture', 'electronics', 'books', 'clothing', 'vehicles', 'appliances', 'sports', 'other'],
      required: true,
    },

    condition: { type: String, enum: ['new', 'like_new', 'good', 'fair', 'poor'], default: 'good' },
    images: [{ type: String }],

    status: { type: String, enum: ['active', 'sold', 'reserved', 'removed'], default: 'active' },
    buyerId: { type: String },

    contactPhone: { type: String },
    flatNumber: { type: String },
    tower: { type: String },

    interestedBuyers: [{ type: String }],
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

marketplaceSchema.index({ societyId: 1, status: 1, category: 1 });

export default mongoose.model('Marketplace', marketplaceSchema);
