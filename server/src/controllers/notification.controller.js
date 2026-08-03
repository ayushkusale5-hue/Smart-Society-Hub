import { Notification } from '../models/mongo/Notification.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';


export async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const filter = { userId: String(req.user.id) };
    if (unreadOnly === 'true') filter.isRead = false;

    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: String(req.user.id), isRead: false }),
    ]);

    return successResponse(res, { notifications, total, unreadCount, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}


export async function getUnreadCount(req, res, next) {
  try {
    const count = await Notification.countDocuments({ userId: String(req.user.id), isRead: false });
    return successResponse(res, { count });
  } catch (err) {
    next(err);
  }
}


export async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: String(req.user.id) },
      { isRead: true },
      { new: true }
    );
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    return successResponse(res, notification);
  } catch (err) {
    next(err);
  }
}


export async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: String(req.user.id), isRead: false }, { isRead: true });
    return successResponse(res, {}, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}


export async function deleteNotification(req, res, next) {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: String(req.user.id) });
    return successResponse(res, {}, 'Notification deleted');
  } catch (err) {
    next(err);
  }
}
