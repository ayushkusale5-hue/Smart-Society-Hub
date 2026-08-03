


import mongoose from 'mongoose';

export async function ensureIndexes() {
  
  const Visitor = mongoose.model('Visitor');
  await Visitor.collection.createIndex({ residentId: 1, status: 1 });
  await Visitor.collection.createIndex({ qrCode: 1 }, { unique: true, sparse: true });
  await Visitor.collection.createIndex({ societyId: 1, createdAt: -1 });

  
  const Complaint = mongoose.model('Complaint');
  await Complaint.collection.createIndex({ societyId: 1, status: 1, createdAt: -1 });
  await Complaint.collection.createIndex({ raisedBy: 1, status: 1 });
  await Complaint.collection.createIndex({ assignedTo: 1, status: 1 });

  
  const Notification = mongoose.model('Notification');
  await Notification.collection.createIndex({ userId: 1, isRead: 1, createdAt: -1 });

  
  const Notice = mongoose.model('Notice');
  await Notice.collection.createIndex({ societyId: 1, isPinned: -1, createdAt: -1 });

  
  const Poll = mongoose.model('Poll');
  await Poll.collection.createIndex({ societyId: 1, status: 1, createdAt: -1 });

  
  const Event = mongoose.model('Event');
  await Event.collection.createIndex({ societyId: 1, startDateTime: 1, status: 1 });

  
  const Marketplace = mongoose.model('Marketplace');
  await Marketplace.collection.createIndex({ societyId: 1, status: 1, category: 1 });

  
  const ChatMessage = mongoose.model('ChatMessage');
  await ChatMessage.collection.createIndex({ societyId: 1, createdAt: -1 });

  console.log('✅ MongoDB indexes ensured');
}
