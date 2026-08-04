import { SosAlert } from '../models/mongo/SosAlert.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { emitToRole } from '../config/socket.js';

// POST /api/sos — any authenticated user
export async function triggerSos(req, res, next) {
  try {
    const { type, message, location } = req.body;

    const alert = new SosAlert({
      triggeredBy: req.user.id,
      triggeredByName: `${req.user.first_name} ${req.user.last_name}`,
      type: type || 'Other',
      message,
      location: location || `${req.user.tower || ''} ${req.user.flat_number || ''}`.trim(),
      societyId: req.user.society_id,
    });

    await alert.save();

    // Broadcast to security, committee, maintenance via Socket.IO
    const alertPayload = {
      _id: alert._id,
      triggeredByName: alert.triggeredByName,
      type: alert.type,
      message: alert.message,
      location: alert.location,
      status: alert.status,
      createdAt: alert.createdAt,
    };

    try {
      emitToRole('security', 'sos:alert', alertPayload);
      emitToRole('committee', 'sos:alert', alertPayload);
      emitToRole('maintenance', 'sos:alert', alertPayload);
    } catch (_) {
      // Socket may not be available, proceed anyway
    }

    return successResponse(res, alert, 'SOS alert triggered — help is on the way!', 201);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/sos/:id/acknowledge — security/committee only
export async function acknowledgeAlert(req, res, next) {
  try {
    const alert = await SosAlert.findById(req.params.id);
    if (!alert) return errorResponse(res, 'Alert not found', 404);

    if (alert.status !== 'Active') {
      return errorResponse(res, 'Alert is already acknowledged or resolved', 400);
    }

    alert.status = 'Acknowledged';
    alert.acknowledgedBy = req.user.id;
    alert.acknowledgedByName = `${req.user.first_name} ${req.user.last_name}`;
    alert.acknowledgedAt = new Date();
    await alert.save();

    return successResponse(res, alert, 'Alert acknowledged');
  } catch (err) {
    next(err);
  }
}

// PATCH /api/sos/:id/resolve — security/committee only
export async function resolveAlert(req, res, next) {
  try {
    const { resolutionNotes } = req.body;
    const alert = await SosAlert.findById(req.params.id);
    if (!alert) return errorResponse(res, 'Alert not found', 404);

    if (alert.status === 'Resolved') {
      return errorResponse(res, 'Alert is already resolved', 400);
    }

    alert.status = 'Resolved';
    alert.resolvedBy = req.user.id;
    alert.resolvedByName = `${req.user.first_name} ${req.user.last_name}`;
    alert.resolvedAt = new Date();
    if (resolutionNotes) alert.resolutionNotes = resolutionNotes;
    await alert.save();

    return successResponse(res, alert, 'Alert resolved');
  } catch (err) {
    next(err);
  }
}

// GET /api/sos — list alerts
export async function getAlerts(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const alerts = await SosAlert.find(filter).sort({ createdAt: -1 }).limit(100);
    return successResponse(res, alerts);
  } catch (err) {
    next(err);
  }
}
