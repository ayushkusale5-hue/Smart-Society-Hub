import bcrypt from 'bcryptjs';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.utils.js';

// ─── Get All Users (Committee only) ──────────────────────────────────────────
export async function getAllUsers(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { page = 1, limit = 20, role, search, isActive } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.flat_number,
             u.tower, u.is_active, u.is_email_verified, u.created_at, r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.society_id = ?
    `;
    const params = [req.user.society_id];

    if (role) { query += ' AND r.name = ?'; params.push(role); }
    if (isActive !== undefined) { query += ' AND u.is_active = ?'; params.push(isActive === 'true' ? 1 : 0); }
    if (search) {
      query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countQuery = query.replace(
      /SELECT .* FROM users u/,
      'SELECT COUNT(*) as total FROM users u'
    );
    const { total } = db.prepare(countQuery).get(...params);

    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    const users = db.prepare(query).all(...params, Number(limit), Number(offset));

    return paginatedResponse(res, users.map(formatUser), total, page, limit);
  } catch (err) {
    next(err);
  }
}

// ─── Get Single User ──────────────────────────────────────────────────────────
export async function getUserById(req, res, next) {
  try {
    const db = getSQLiteDB();
    const user = db.prepare(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.flat_number,
             u.tower, u.society_id, u.avatar_url, u.is_active, u.is_email_verified,
             u.last_login, u.created_at, r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(req.params.id);

    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, formatUser(user));
  } catch (err) {
    next(err);
  }
}

// ─── Update Profile ───────────────────────────────────────────────────────────
export async function updateProfile(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { firstName, lastName, phone, flatNumber, tower } = req.body;

    db.prepare(`
      UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name),
      phone = COALESCE(?, phone), flat_number = COALESCE(?, flat_number), tower = COALESCE(?, tower)
      WHERE id = ?
    `).run(firstName, lastName, phone, flatNumber, tower, req.user.id);

    const updated = db.prepare(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.flat_number,
             u.tower, u.avatar_url, r.name AS role
      FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?
    `).get(req.user.id);

    return successResponse(res, formatUser(updated), 'Profile updated');
  } catch (err) {
    next(err);
  }
}

// ─── Update Avatar ────────────────────────────────────────────────────────────
export async function updateAvatar(req, res, next) {
  try {
    if (!req.file) return errorResponse(res, 'No file uploaded', 400);

    const db = getSQLiteDB();
    const avatarUrl = req.file.path; // Cloudinary URL

    db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatarUrl, req.user.id);
    return successResponse(res, { avatarUrl }, 'Avatar updated');
  } catch (err) {
    next(err);
  }
}

// ─── Change Password ──────────────────────────────────────────────────────────
export async function changePassword(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { currentPassword, newPassword } = req.body;

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) return errorResponse(res, 'Current password is incorrect', 400);

    const newHash = await bcrypt.hash(newPassword, 12);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);

    // Invalidate all refresh tokens
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(req.user.id);

    return successResponse(res, {}, 'Password changed. Please login again.');
  } catch (err) {
    next(err);
  }
}

// ─── Toggle User Active (Committee) ──────────────────────────────────────────
export async function toggleUserActive(req, res, next) {
  try {
    const db = getSQLiteDB();
    const user = db.prepare('SELECT id, is_active FROM users WHERE id = ?').get(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);

    const newStatus = user.is_active ? 0 : 1;
    db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(newStatus, req.params.id);

    return successResponse(res, { isActive: Boolean(newStatus) },
      `User ${newStatus ? 'activated' : 'deactivated'}`);
  } catch (err) {
    next(err);
  }
}

// Helper
function formatUser(u) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.first_name,
    lastName: u.last_name,
    phone: u.phone,
    role: u.role,
    flatNumber: u.flat_number,
    tower: u.tower,
    societyId: u.society_id,
    avatarUrl: u.avatar_url,
    isActive: Boolean(u.is_active),
    isEmailVerified: Boolean(u.is_email_verified),
    lastLogin: u.last_login,
    createdAt: u.created_at,
  };
}
