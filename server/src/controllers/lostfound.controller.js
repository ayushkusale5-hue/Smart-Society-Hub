import { LostFound } from '../models/mongo/LostFound.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

// POST /api/lost-found
export async function createItem(req, res, next) {
  try {
    const { title, description, type, category, location, date, contactPhone } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/documents/${f.filename}`) : [];
    const item = new LostFound({
      title, description, type, category, location, date, contactPhone, images,
      reportedBy: req.user.id,
      reportedByName: `${req.user.first_name} ${req.user.last_name}`,
      societyId: req.user.society_id,
    });
    await item.save();
    return successResponse(res, item, 'Item reported', 201);
  } catch (err) { next(err); }
}

// GET /api/lost-found
export async function getItems(req, res, next) {
  try {
    const { type, status, category } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    const items = await LostFound.find(filter).sort({ createdAt: -1 });
    return successResponse(res, items);
  } catch (err) { next(err); }
}

// PATCH /api/lost-found/:id — update status (claim/resolve)
export async function updateItem(req, res, next) {
  try {
    const { status } = req.body;
    const item = await LostFound.findById(req.params.id);
    if (!item) return errorResponse(res, 'Item not found', 404);

    if (status === 'Claimed') {
      item.status = 'Claimed';
      item.claimedBy = req.user.id;
      item.claimedByName = `${req.user.first_name} ${req.user.last_name}`;
    } else if (status) {
      item.status = status;
    }
    await item.save();
    return successResponse(res, item, 'Item updated');
  } catch (err) { next(err); }
}

// DELETE /api/lost-found/:id
export async function deleteItem(req, res, next) {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return errorResponse(res, 'Item not found', 404);
    if (item.reportedBy !== String(req.user.id) && req.user.role !== 'committee') {
      return errorResponse(res, 'Unauthorized', 403);
    }
    await LostFound.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Item deleted');
  } catch (err) { next(err); }
}
