import { Facility, Booking } from '../models/facility.model.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';


export async function getFacilities(req, res, next) {
  try {
    const facilities = await Facility.find({ societyId: 'DEFAULT_SOCIETY' });
    
    
    if (facilities.length === 0) {
      const defaults = [
        { societyId: 'DEFAULT_SOCIETY', name: 'Grand Clubhouse', type: 'clubhouse', description: 'Main clubhouse for society events', capacity: 200, pricePerHour: 500, requiresApproval: true },
        { societyId: 'DEFAULT_SOCIETY', name: 'Fitness Center', type: 'gym', description: 'Fully equipped gym', capacity: 30, pricePerHour: 0, requiresApproval: false },
        { societyId: 'DEFAULT_SOCIETY', name: 'Olympic Pool', type: 'swimming_pool', description: 'Temperature controlled pool', capacity: 50, pricePerHour: 0, requiresApproval: false },
        { societyId: 'DEFAULT_SOCIETY', name: 'Tennis Court', type: 'tennis_court', description: 'Synthetic court', capacity: 4, pricePerHour: 100, requiresApproval: false },
      ];
      const inserted = await Facility.insertMany(defaults);
      return successResponse(res, inserted);
    }

    return successResponse(res, facilities);
  } catch (err) {
    next(err);
  }
}


export async function bookFacility(req, res, next) {
  try {
    const { facilityId, date, startTime, endTime, purpose } = req.body;

    const facility = await Facility.findById(facilityId);
    if (!facility) return errorResponse(res, 'Facility not found', 404);

    
    const overlapping = await Booking.findOne({
      facilityId,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    if (overlapping) {
      return errorResponse(res, 'Time slot is already booked', 400);
    }

    const duration = parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0]);
    const amount = duration * facility.pricePerHour;

    const booking = new Booking({
      facilityId,
      bookedBy: req.user.id,
      societyId: 'DEFAULT_SOCIETY',
      date: new Date(date),
      startTime,
      endTime,
      duration,
      purpose,
      status: facility.requiresApproval ? 'pending' : 'approved',
      amount
    });

    await booking.save();
    return successResponse(res, booking, 'Facility booked successfully', 201);
  } catch (err) {
    next(err);
  }
}


export async function getBookings(req, res, next) {
  try {
    const filter = { societyId: 'DEFAULT_SOCIETY' };
    
    if (req.user.role === 'resident') {
      filter.bookedBy = req.user.id;
    }
    
    const bookings = await Booking.find(filter)
      .populate('facilityId', 'name type')
      .sort({ date: -1, startTime: -1 });

    const enriched = bookings.map(b => {
      const bObj = b.toObject();
      const db = getSQLiteDB();
      const user = db.prepare('SELECT first_name, last_name, flat_number FROM users WHERE id = ?').get(bObj.bookedBy);
      return { ...bObj, resident: user || { first_name: 'Unknown', last_name: 'User', flat_number: 'N/A' } };
    });

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
}


export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const booking = await Booking.findById(id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);

    booking.status = status;
    booking.approvedBy = req.user.id;
    await booking.save();

    return successResponse(res, booking, 'Booking status updated');
  } catch (err) {
    next(err);
  }
}


export async function deleteBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);

    if (booking.bookedBy !== req.user.id && req.user.role !== 'committee') {
      return errorResponse(res, 'Unauthorized', 403);
    }

    if (booking.status === 'approved' && new Date(booking.startTime) < new Date()) {
      return errorResponse(res, 'Cannot cancel a booking that has already started', 400);
    }

    await Booking.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Booking canceled successfully');
  } catch (err) {
    next(err);
  }
}
