import { VehicleLog } from '../models/mongo/VehicleLog.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

// POST /api/vehicles/entry — security only
export async function logVehicleEntry(req, res, next) {
  try {
    const { vehicleNumber, vehicleType, driverName, purpose, flatNumber, notes } = req.body;

    const log = new VehicleLog({
      vehicleNumber,
      vehicleType: vehicleType || 'Car',
      driverName,
      purpose,
      flatNumber,
      notes,
      entryTime: new Date(),
      loggedBy: req.user.id,
      loggedByName: `${req.user.first_name} ${req.user.last_name}`,
      societyId: req.user.society_id,
    });

    await log.save();
    return successResponse(res, log, 'Vehicle entry logged', 201);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/vehicles/:id/exit — security only
export async function logVehicleExit(req, res, next) {
  try {
    const log = await VehicleLog.findById(req.params.id);
    if (!log) return errorResponse(res, 'Vehicle log not found', 404);

    if (log.exitTime) {
      return errorResponse(res, 'Exit already logged', 400);
    }

    log.exitTime = new Date();
    await log.save();
    return successResponse(res, log, 'Vehicle exit logged');
  } catch (err) {
    next(err);
  }
}

// GET /api/vehicles — list logs
export async function getVehicleLogs(req, res, next) {
  try {
    const { date, vehicleNumber } = req.query;
    const filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.entryTime = { $gte: start, $lte: end };
    }

    if (vehicleNumber) {
      filter.vehicleNumber = { $regex: vehicleNumber, $options: 'i' };
    }

    const logs = await VehicleLog.find(filter).sort({ entryTime: -1 }).limit(200);
    return successResponse(res, logs);
  } catch (err) {
    next(err);
  }
}
