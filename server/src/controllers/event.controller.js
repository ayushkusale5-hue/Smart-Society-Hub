import { Event } from '../models/mongo/Event.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

// POST /api/events — committee creates event
export async function createEvent(req, res, next) {
  try {
    const { title, description, date, endDate, time, venue, category, organizer, maxAttendees } = req.body;
    const event = new Event({
      title, description, date, endDate, time, venue, category, organizer, maxAttendees,
      createdBy: req.user.id,
      createdByName: `${req.user.first_name} ${req.user.last_name}`,
      societyId: req.user.society_id,
    });
    await event.save();
    return successResponse(res, event, 'Event created', 201);
  } catch (err) { next(err); }
}

// GET /api/events
export async function getEvents(req, res, next) {
  try {
    const { category, upcoming } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (upcoming === 'true') filter.date = { $gte: new Date() };
    const events = await Event.find(filter).sort({ date: 1 });
    return successResponse(res, events);
  } catch (err) { next(err); }
}

// GET /api/events/:id
export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, event);
  } catch (err) { next(err); }
}

// PATCH /api/events/:id — committee updates event
export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, event, 'Event updated');
  } catch (err) { next(err); }
}

// DELETE /api/events/:id
export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);
    return successResponse(res, null, 'Event deleted');
  } catch (err) { next(err); }
}

// POST /api/events/:id/rsvp — resident RSVPs
export async function rsvpEvent(req, res, next) {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);

    const existing = event.rsvps.find(r => r.userId === String(req.user.id));
    if (existing) {
      existing.status = status || 'Going';
      existing.rsvpAt = new Date();
    } else {
      if (event.maxAttendees > 0 && event.rsvps.filter(r => r.status === 'Going').length >= event.maxAttendees) {
        return errorResponse(res, 'Event is full', 400);
      }
      event.rsvps.push({
        userId: String(req.user.id),
        userName: `${req.user.first_name} ${req.user.last_name}`,
        status: status || 'Going',
      });
    }
    await event.save();
    return successResponse(res, event, 'RSVP updated');
  } catch (err) { next(err); }
}
