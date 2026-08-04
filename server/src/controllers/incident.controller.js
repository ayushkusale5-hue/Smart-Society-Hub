import { Incident } from '../models/mongo/Incident.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

// POST /api/incidents — security/committee
export async function createIncident(req, res, next) {
  try {
    const { title, description, category, priority, location } = req.body;
    const evidence = req.files ? req.files.map(f => `/uploads/incidents/${f.filename}`) : [];

    const incident = new Incident({
      title,
      description,
      category,
      priority,
      location,
      evidence,
      reportedBy: req.user.id,
      reportedByName: `${req.user.first_name} ${req.user.last_name}`,
      societyId: req.user.society_id,
    });

    await incident.save();
    return successResponse(res, incident, 'Incident reported successfully', 201);
  } catch (err) {
    next(err);
  }
}

// GET /api/incidents
export async function getIncidents(req, res, next) {
  try {
    const { status, category, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Security sees all; others see only their own
    if (req.user.role !== 'security' && req.user.role !== 'committee') {
      filter.reportedBy = req.user.id;
    }

    const incidents = await Incident.find(filter).sort({ createdAt: -1 });
    return successResponse(res, incidents);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/incidents/:id — update status/resolution
export async function updateIncident(req, res, next) {
  try {
    const { status, resolutionNotes, assignedTo } = req.body;
    const incident = await Incident.findById(req.params.id);
    if (!incident) return errorResponse(res, 'Incident not found', 404);

    if (status) incident.status = status;
    if (resolutionNotes) incident.resolutionNotes = resolutionNotes;
    if (assignedTo) incident.assignedTo = assignedTo;

    await incident.save();
    return successResponse(res, incident, 'Incident updated');
  } catch (err) {
    next(err);
  }
}

// DELETE /api/incidents/:id — security/committee
export async function deleteIncident(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return errorResponse(res, 'Incident not found', 404);

    if (incident.reportedBy !== req.user.id && req.user.role !== 'committee') {
      return errorResponse(res, 'Unauthorized', 403);
    }

    await Incident.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Incident deleted');
  } catch (err) {
    next(err);
  }
}
