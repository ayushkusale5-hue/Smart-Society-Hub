import { Parking } from '../models/parking.model.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';


export async function getParkingSlots(req, res, next) {
  try {
    const slots = await Parking.find({ societyId: 'DEFAULT_SOCIETY' }).sort({ slotNumber: 1 });
    
    
    if (slots.length === 0) {
      const defaults = [];
      for (let i = 1; i <= 20; i++) {
        defaults.push({ societyId: 'DEFAULT_SOCIETY', slotNumber: `A-${i}`, type: 'car' });
      }
      for (let i = 1; i <= 5; i++) {
        defaults.push({ societyId: 'DEFAULT_SOCIETY', slotNumber: `V-${i}`, type: 'car', isGuest: true });
      }
      const inserted = await Parking.insertMany(defaults);
      return successResponse(res, inserted);
    }

    const enriched = slots.map(slot => {
      const sObj = slot.toObject();
      if (sObj.assignedTo) {
        const db = getSQLiteDB();
        const user = db.prepare('SELECT first_name, last_name, flat_number FROM users WHERE id = ?').get(sObj.assignedTo);
        if (user) {
          sObj.resident = user;
        }
      }
      return sObj;
    });

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
}


export async function assignSlot(req, res, next) {
  try {
    const { id } = req.params;
    const { assignedTo, vehicleNumber } = req.body;

    const slot = await Parking.findById(id);
    if (!slot) return errorResponse(res, 'Slot not found', 404);
    if (slot.isGuest) return errorResponse(res, 'Cannot assign guest slots to residents', 400);

    
    if (!assignedTo) {
      slot.assignedTo = undefined;
      slot.vehicleNumber = undefined;
      slot.status = 'available';
    } else {
      slot.assignedTo = assignedTo;
      slot.vehicleNumber = vehicleNumber;
      slot.status = 'occupied';
    }

    await slot.save();
    return successResponse(res, slot, 'Parking slot updated successfully');
  } catch (err) {
    next(err);
  }
}


export async function updateMyVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const { vehicleNumber } = req.body;

    const slot = await Parking.findById(id);
    if (!slot) return errorResponse(res, 'Slot not found', 404);

    if (slot.assignedTo !== req.user.id) {
      return errorResponse(res, 'You can only update your assigned slot', 403);
    }

    slot.vehicleNumber = vehicleNumber;
    await slot.save();

    return successResponse(res, slot, 'Vehicle number updated');
  } catch (err) {
    next(err);
  }
}
