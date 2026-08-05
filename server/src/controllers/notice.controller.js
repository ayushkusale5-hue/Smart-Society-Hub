import { Notice } from '../models/mongo/Notice.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';
import { emitToSociety } from '../config/socket.js';
import { generateNoticeAI } from '../utils/ai.utils.js';


export async function createNotice(req, res, next) {
  try {
    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can create notices', 403);
    }

    const { title, content, type, priority, isPinned, expiresAt } = req.body;

    const notice = new Notice({
      title,
      content,
      type: type || 'general',
      priority: priority || 'normal',
      isPinned: Boolean(isPinned),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: req.user.id,
      societyId: req.user.society_id,
    });

    await notice.save();

    
    emitToSociety(req.user.society_id, 'notice:new', {
      noticeId: notice._id,
      title: notice.title,
      type: notice.type,
      priority: notice.priority,
    });

    return successResponse(res, notice, 'Notice published successfully', 201);
  } catch (err) {
    next(err);
  }
}


export async function getNotices(req, res, next) {
  try {
    const { type, priority, limit = 30, page = 1 } = req.query;
    const filter = {};

    if (req.user.society_id) filter.societyId = req.user.society_id;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    
    filter.$or = [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }];

    const skip = (page - 1) * limit;
    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Notice.countDocuments(filter),
    ]);

    
    const db = getSQLiteDB();
    const enriched = notices.map((n) => {
      const author = db
        .prepare('SELECT first_name, last_name FROM users WHERE id = ?')
        .get(n.createdBy);
      return {
        ...n.toObject(),
        author: author ? `${author.first_name} ${author.last_name}` : 'Committee',
      };
    });

    return successResponse(res, { notices: enriched, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}


export async function updateNotice(req, res, next) {
  try {
    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can update notices', 403);
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) return errorResponse(res, 'Notice not found', 404);

    const { title, content, type, priority, expiresAt } = req.body;
    if (title) notice.title = title;
    if (content) notice.content = content;
    if (type) notice.type = type;
    if (priority) notice.priority = priority;
    if (expiresAt !== undefined) notice.expiresAt = expiresAt ? new Date(expiresAt) : undefined;

    await notice.save();
    return successResponse(res, notice, 'Notice updated successfully');
  } catch (err) {
    next(err);
  }
}


export async function deleteNotice(req, res, next) {
  try {
    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can delete notices', 403);
    }

    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return errorResponse(res, 'Notice not found', 404);

    return successResponse(res, {}, 'Notice deleted successfully');
  } catch (err) {
    next(err);
  }
}


export async function togglePin(req, res, next) {
  try {
    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can pin notices', 403);
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) return errorResponse(res, 'Notice not found', 404);

    notice.isPinned = !notice.isPinned;
    await notice.save();

    return successResponse(res, notice, `Notice ${notice.isPinned ? 'pinned' : 'unpinned'}`);
  } catch (err) {
    next(err);
  }
}

// Generate notice using AI
export async function generateNoticeDraft(req, res, next) {
  try {
    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can generate notices', 403);
    }

    const { prompt } = req.body;
    if (!prompt) return errorResponse(res, 'Prompt is required', 400);

    const generatedContent = await generateNoticeAI(prompt);
    
    return successResponse(res, { content: generatedContent }, 'Notice generated successfully');
  } catch (err) {
    next(err);
  }
}
