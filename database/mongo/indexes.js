// MongoDB Index Definitions for Smart Society Hub
// Run this after connecting to MongoDB

import mongoose from 'mongoose';

export async function ensureIndexes() {
  // Visitor indexes
  const Visitor = mongoose.model('Visitor');
  await Visitor.collection.createIndex({ residentId: 1, status: 1 });
  await Visitor.collection.createIndex({ qrCode: 1 }, { unique: true, sparse: true });
  await Visitor.collection.createIndex({ societyId: 1, createdAt: -1 });

  // Complaint indexes
  const Complaint = mongoose.model('Complaint');
  await Complaint.collection.createIndex({ societyId: 1, status: 1, createdAt: -1 });
  await Complaint.collection.createIndex({ raisedBy: 1, status: 1 });
  await Complaint.collection.createIndex({ assignedTo: 1, status: 1 });

  // Notification indexes
  const Notification = mongoose.model('Notification');
  await Notification.collection.createIndex({ userId: 1, isRead: 1, createdAt: -1 });

  // Notice indexes
  const Notice = mongoose.model('Notice');
  await Notice.collection.createIndex({ societyId: 1, isPinned: -1, createdAt: -1 });

  // Poll indexes
  const Poll = mongoose.model('Poll');
  await Poll.collection.createIndex({ societyId: 1, status: 1, createdAt: -1 });

  // Event indexes
  const Event = mongoose.model('Event');
  await Event.collection.createIndex({ societyId: 1, startDateTime: 1, status: 1 });

  // Marketplace indexes
  const Marketplace = mongoose.model('Marketplace');
  await Marketplace.collection.createIndex({ societyId: 1, status: 1, category: 1 });

  // Chat indexes
  const ChatMessage = mongoose.model('ChatMessage');
  await ChatMessage.collection.createIndex({ societyId: 1, createdAt: -1 });

  console.log('✅ MongoDB indexes ensured');
}
