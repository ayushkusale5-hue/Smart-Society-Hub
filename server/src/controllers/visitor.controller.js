import crypto from 'crypto';
import { Visitor } from '../models/mongo/Visitor.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { emitToUser, emitToRole } from '../config/socket.js';
import Notification from '../models/mongo/Notification.js';


function generateQRToken() {
  return crypto.randomBytes(16).toString('hex');
}


export async function inviteVisitor(req, res, next) {
  try {
    const { name, phone, purpose, vehicleNumber, expectedArrival, passType, validFrom, validUntil } = req.body;

    if (req.user.role !== 'resident') {
      return errorResponse(res, 'Only residents can invite visitors', 403);
    }

    const qrCode = generateQRToken();

    const visitor = new Visitor({
      name,
      phone,
      purpose,
      vehicleNumber,
      expectedArrival: expectedArrival ? new Date(expectedArrival) : undefined,
      passType: passType || 'single',
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      hostId: req.user.id,
      societyId: req.user.society_id,
      status: 'Expected',
      qrCode,
    });

    await visitor.save();

    
    emitToRole('security', 'visitor:new', {
      visitorId: visitor._id,
      visitorName: name,
      hostId: req.user.id,
      hostName: `${req.user.first_name} ${req.user.last_name}`,
    });

    return successResponse(res, visitor, 'Visitor invited successfully', 201);
  } catch (err) {
    next(err);
  }
}


export async function getMyVisitors(req, res, next) {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const filter = { hostId: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [visitors, total] = await Promise.all([
      Visitor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Visitor.countDocuments(filter),
    ]);

    return successResponse(res, { visitors, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}


export async function getAllVisitors(req, res, next) {
  try {
    if (!['committee', 'security'].includes(req.user.role)) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    const { status, date, limit = 30, page = 1 } = req.query;
    const filter = {};
    if (req.user.society_id) filter.societyId = req.user.society_id;
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const skip = (page - 1) * limit;
    const [visitors, total] = await Promise.all([
      Visitor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Visitor.countDocuments(filter),
    ]);

    
    const db = getSQLiteDB();
    const enriched = visitors.map((v) => {
      const host = db.prepare('SELECT first_name, last_name, flat_number, tower FROM users WHERE id = ?').get(v.hostId);
      return {
        ...v.toObject(),
        host: host
          ? {
              name: `${host.first_name} ${host.last_name}`,
              flatNumber: host.flat_number,
              tower: host.tower,
            }
          : null,
      };
    });

    return successResponse(res, { visitors: enriched, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}


export async function getExpectedVisitors(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filter = {
      status: 'Expected',
      $or: [
        { expectedArrival: { $gte: today, $lt: tomorrow } },
        { expectedArrival: { $exists: false } },
        { expectedArrival: null },
      ],
    };

    if (req.user.society_id) filter.societyId = req.user.society_id;

    const visitors = await Visitor.find(filter).sort({ expectedArrival: 1, createdAt: -1 }).limit(50);

    
    const db = getSQLiteDB();
    const enriched = visitors.map((v) => {
      const host = db.prepare('SELECT first_name, last_name, flat_number, tower FROM users WHERE id = ?').get(v.hostId);
      return {
        ...v.toObject(),
        host: host
          ? {
              name: `${host.first_name} ${host.last_name}`,
              flatNumber: host.flat_number,
              tower: host.tower,
            }
          : null,
      };
    });

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
}


export async function scanQR(req, res, next) {
  try {
    const { qrCode } = req.params;
    const visitor = await Visitor.findOne({ qrCode });
    if (!visitor) return errorResponse(res, 'Invalid QR code — visitor not found', 404);

    const db = getSQLiteDB();
    const host = db.prepare('SELECT first_name, last_name, flat_number, tower FROM users WHERE id = ?').get(visitor.hostId);

    return successResponse(res, {
      ...visitor.toObject(),
      host: host
        ? { name: `${host.first_name} ${host.last_name}`, flatNumber: host.flat_number, tower: host.tower }
        : null,
    });
  } catch (err) {
    next(err);
  }
}


export async function markEntry(req, res, next) {
  try {
    if (!['security', 'committee'].includes(req.user.role)) {
      return errorResponse(res, 'Only security or committee can verify entry', 403);
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return errorResponse(res, 'Visitor not found', 404);
    if (visitor.status === 'Inside') return errorResponse(res, 'Visitor already inside', 400);
    if (visitor.status === 'Exited') return errorResponse(res, 'Visitor has already exited', 400);

    visitor.status = 'Inside';
    visitor.actualEntry = new Date();
    await visitor.save();

    
    emitToUser(visitor.hostId, 'visitor:entry', {
      visitorName: visitor.name,
      entryTime: visitor.actualEntry,
    });

    
    await Notification.create({
      userId: String(visitor.hostId),
      societyId: visitor.societyId,
      title: 'Visitor Arrived',
      message: `${visitor.name} has entered the society.`,
      type: 'visitor_arrived',
      referenceId: String(visitor._id),
      referenceModel: 'Visitor',
      link: '/visitors',
    });

    return successResponse(res, visitor, 'Entry marked successfully');
  } catch (err) {
    next(err);
  }
}


export async function markExit(req, res, next) {
  try {
    if (!['security', 'committee'].includes(req.user.role)) {
      return errorResponse(res, 'Only security or committee can verify exit', 403);
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return errorResponse(res, 'Visitor not found', 404);
    if (visitor.status !== 'Inside') return errorResponse(res, 'Visitor is not currently inside', 400);

    visitor.status = 'Exited';
    visitor.actualExit = new Date();
    await visitor.save();

    return successResponse(res, visitor, 'Exit marked successfully');
  } catch (err) {
    next(err);
  }
}


export async function denyVisitor(req, res, next) {
  try {
    if (!['security', 'committee'].includes(req.user.role)) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return errorResponse(res, 'Visitor not found', 404);

    visitor.status = 'Denied';
    await visitor.save();

    return successResponse(res, visitor, 'Visitor denied');
  } catch (err) {
    next(err);
  }
}


export async function deleteVisitor(req, res, next) {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return errorResponse(res, 'Visitor not found', 404);
    
    if (visitor.hostId !== req.user.id) {
      return errorResponse(res, 'You can only delete your own visitors', 403);
    }
    
    if (visitor.status === 'Inside') {
      return errorResponse(res, 'Cannot delete visitor who is currently inside', 400);
    }

    await Visitor.findByIdAndDelete(req.params.id);
    
    return successResponse(res, null, 'Visitor deleted successfully');
  } catch (err) {
    next(err);
  }
}
