import Marketplace from '../models/marketplace.model.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';


export async function getListings(req, res, next) {
  try {
    const { category, search } = req.query;
    const filter = { societyId: 'DEFAULT_SOCIETY', status: 'active' };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Marketplace.find(filter).sort({ createdAt: -1 });

    const enriched = listings.map(l => {
      const lObj = l.toObject();
      const db = getSQLiteDB();
      const user = db.prepare('SELECT first_name, last_name, flat_number, tower FROM users WHERE id = ?').get(lObj.sellerId);
      return { ...lObj, seller: user || { first_name: 'Unknown', last_name: 'Resident' } };
    });

    return successResponse(res, enriched);
  } catch (err) {
    next(err);
  }
}


export async function createListing(req, res, next) {
  try {
    const { title, description, price, category, condition, isNegotiable, contactPhone } = req.body;

    if (!title || !description || !price || !category) {
      return errorResponse(res, 'Title, description, price, and category are required', 400);
    }

    const db = getSQLiteDB();
    const user = db.prepare('SELECT flat_number, tower FROM users WHERE id = ?').get(req.user.id);

    const listing = new Marketplace({
      sellerId: req.user.id,
      societyId: 'DEFAULT_SOCIETY',
      title,
      description,
      price,
      category,
      condition,
      isNegotiable,
      contactPhone,
      flatNumber: user?.flat_number,
      tower: user?.tower
    });

    await listing.save();
    return successResponse(res, listing, 'Listing created successfully', 201);
  } catch (err) {
    next(err);
  }
}


export async function expressInterest(req, res, next) {
  try {
    const { id } = req.params;
    const listing = await Marketplace.findById(id);

    if (!listing) return errorResponse(res, 'Listing not found', 404);
    if (listing.sellerId === req.user.id) return errorResponse(res, 'You cannot express interest in your own listing', 400);

    if (!listing.interestedBuyers.includes(req.user.id)) {
      listing.interestedBuyers.push(req.user.id);
      await listing.save();
    }

    return successResponse(res, null, 'Interest registered and seller notified');
  } catch (err) {
    next(err);
  }
}


export async function updateListing(req, res, next) {
  try {
    const { title, description, price, category, images, status } = req.body;
    const listing = await Marketplace.findById(req.params.id);
    
    if (!listing) return errorResponse(res, 'Listing not found', 404);
    if (listing.sellerId !== req.user.id) return errorResponse(res, 'Unauthorized', 403);

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price !== undefined) listing.price = price;
    if (category) listing.category = category;
    if (images) listing.images = images;
    if (status) listing.status = status;

    await listing.save();
    return successResponse(res, listing, 'Listing updated successfully');
  } catch (err) {
    next(err);
  }
}


export async function deleteListing(req, res, next) {
  try {
    const listing = await Marketplace.findById(req.params.id);
    
    if (!listing) return errorResponse(res, 'Listing not found', 404);
    if (listing.sellerId !== req.user.id && req.user.role !== 'committee') {
      return errorResponse(res, 'Unauthorized', 403);
    }

    await Marketplace.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Listing deleted successfully');
  } catch (err) {
    next(err);
  }
}
