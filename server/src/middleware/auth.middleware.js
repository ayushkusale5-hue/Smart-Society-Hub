import { verifyAccessToken } from '../utils/jwt.utils.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { errorResponse } from '../utils/response.utils.js';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access token required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    
    const db = getSQLiteDB();
    const user = db.prepare(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.role_id, u.flat_number,
             u.tower, u.society_id, u.is_active, u.is_email_verified, u.avatar_url,
             r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(decoded.id);

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    if (!user.is_active) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid access token', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
}


export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const db = getSQLiteDB();
      const user = db.prepare(`
        SELECT u.id, u.email, u.first_name, u.last_name, u.role_id,
               r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(decoded.id);
      if (user) req.user = user;
    }
  } catch (_) {
    
  }
  next();
}
