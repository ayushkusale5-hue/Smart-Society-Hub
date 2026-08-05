import { Complaint } from '../models/mongo/Complaint.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { categorizeComplaintAI } from '../utils/ai.utils.js';


export async function createComplaint(req, res, next) {
  try {
    const { title, description, category, priority } = req.body;
    
    
    const images = req.files ? req.files.map(f => `/uploads/complaints/${f.filename}`) : [];

    let finalCategory = category;
    let finalPriority = priority;

    if (!finalCategory || finalCategory === 'Other') {
      const aiResult = await categorizeComplaintAI(title, description);
      if (aiResult) {
        finalCategory = aiResult.category || 'Other';
        finalPriority = aiResult.priority || finalPriority || 'Low';
      }
    }

    const complaint = new Complaint({
      title,
      description,
      category: finalCategory || 'Other',
      priority: finalPriority || 'Low',
      images,
      residentId: req.user.id,
    });

    await complaint.save();
    return successResponse(res, complaint, 'Complaint raised successfully', 201);
  } catch (err) {
    next(err);
  }
}


export async function getComplaints(req, res, next) {
  try {
    const { status, category, priority } = req.query;
    
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    
    if (req.user.role === 'resident') {
      
      filter.residentId = req.user.id;
    } else if (req.user.role === 'maintenance') {
      
      filter.assignedTo = req.user.id;
    }
    

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    return successResponse(res, complaints);
  } catch (err) {
    next(err);
  }
}


export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return errorResponse(res, 'Complaint not found', 404);

    
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


export async function assignComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body; 

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


export async function deleteComplaint(req, res, next) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return errorResponse(res, 'Complaint not found', 404);

    if (complaint.residentId !== req.user.id && req.user.role !== 'committee') {
      return errorResponse(res, 'Unauthorized', 403);
    }

    if (complaint.status === 'resolved' || complaint.status === 'in_progress') {
      return errorResponse(res, 'Cannot withdraw a complaint that is in progress or resolved', 400);
    }

    await Complaint.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Complaint withdrawn successfully');
  } catch (err) {
    next(err);
  }
}
