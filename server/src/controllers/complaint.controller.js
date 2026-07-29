import { Complaint } from '../models/mongo/Complaint.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

// ─── Create Complaint (Resident) ──────────────────────────────────────────────
export async function createComplaint(req, res, next) {
  try {
    const { title, description, category, priority } = req.body;
    
    // Process uploaded images
    const images = req.files ? req.files.map(f => `/uploads/complaints/${f.filename}`) : [];

    const complaint = new Complaint({
      title,
      description,
      category,
      priority,
      images,
      residentId: req.user.id,
    });

    await complaint.save();
    return successResponse(res, complaint, 'Complaint raised successfully', 201);
  } catch (err) {
    next(err);
  }
}

// ─── Get Complaints ───────────────────────────────────────────────────────────
export async function getComplaints(req, res, next) {
  try {
    const { status, category, priority } = req.query;
    
    // Base filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Role-based filtering
    if (req.user.role === 'resident') {
      // Residents only see their own complaints
      filter.residentId = req.user.id;
    } else if (req.user.role === 'maintenance') {
      // Maintenance staff only see complaints assigned to them
      filter.assignedTo = req.user.id;
    }
    // Committee sees all complaints (filtered by query params if any)

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    return successResponse(res, complaints);
  } catch (err) {
    next(err);
  }
}

// ─── Update Complaint Status ──────────────────────────────────────────────────
export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return errorResponse(res, 'Complaint not found', 404);

    // Permission checks
    if (req.user.role === 'resident') {
      return errorResponse(res, 'Residents cannot update complaint status', 403);
    }
    
    if (req.user.role === 'maintenance' && complaint.assignedTo !== req.user.id) {
      return errorResponse(res, 'You are not assigned to this complaint', 403);
    }

    complaint.status = status;
    if (resolutionNotes) {
      complaint.resolutionNotes = resolutionNotes;
    }

    await complaint.save();
    return successResponse(res, complaint, 'Status updated successfully');
  } catch (err) {
    next(err);
  }
}

// ─── Assign Complaint (Committee only) ────────────────────────────────────────
export async function assignComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body; // SQLite User ID of maintenance staff

    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can assign complaints', 403);
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) return errorResponse(res, 'Complaint not found', 404);

    complaint.assignedTo = assignedTo;
    complaint.status = 'Assigned';

    await complaint.save();
    return successResponse(res, complaint, 'Complaint assigned successfully');
  } catch (err) {
    next(err);
  }
}
