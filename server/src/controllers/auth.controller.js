import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getSQLiteDB } from '../config/db.sqlite.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyRefreshToken,
  verifyAccessToken,
} from '../utils/jwt.utils.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '../utils/email.utils.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

// ─── Register ─────────────────────────────────────────────────────────────────
export async function register(req, res, next) {
  try {
    const db = getSQLiteDB();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'resident',
      flatNumber,
      tower,
      societyId,
    } = req.body;

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return errorResponse(res, 'Email already registered', 409);
    }

    // Get role ID
    const roleRow = db.prepare('SELECT id, name FROM roles WHERE name = ?').get(role);
    if (!roleRow) {
      return errorResponse(res, 'Invalid role specified', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const userId = uuidv4().replace(/-/g, '');
    const verificationToken = generateEmailVerificationToken({ id: userId });
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role_id,
                         flat_number, tower, society_id, email_verification_token, email_verification_expires)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      phone || null,
      roleRow.id,
      flatNumber || null,
      tower || null,
      societyId || null,
      verificationToken,
      verificationExpires
    );

    // Send verification email (non-blocking)
    sendVerificationEmail(email, firstName, verificationToken).catch(console.error);

    return successResponse(
      res,
      { userId, email: email.toLowerCase() },
      'Registration successful. Please verify your email.',
      201
    );
  } catch (err) {
    next(err);
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { email, password } = req.body;

    const user = db.prepare(`
      SELECT u.*, r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `).get(email.toLowerCase());

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (!user.is_active) {
      return errorResponse(res, 'Account is deactivated. Contact committee.', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO refresh_tokens (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4().replace(/-/g, ''), user.id, refreshToken, expiresAt);

    // Update last_login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    return successResponse(res, {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        flatNumber: user.flat_number,
        tower: user.tower,
        societyId: user.society_id,
        avatarUrl: user.avatar_url,
        isEmailVerified: Boolean(user.is_email_verified),
      },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

// ─── Refresh Token ────────────────────────────────────────────────────────────
export async function refreshToken(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { refreshToken: token } = req.body;

    if (!token) return errorResponse(res, 'Refresh token required', 401);

    // Verify token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return errorResponse(res, 'Invalid or expired refresh token', 401);
    }

    // Check token exists in DB and not expired
    const storedToken = db.prepare(`
      SELECT * FROM refresh_tokens
      WHERE token = ? AND expires_at > datetime('now') AND user_id = ?
    `).get(token, decoded.id);

    if (!storedToken) return errorResponse(res, 'Refresh token invalid or expired', 401);

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    return successResponse(res, { accessToken: newAccessToken }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { refreshToken: token } = req.body;

    if (token) {
      db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
    }

    return successResponse(res, {}, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}

// ─── Verify Email ─────────────────────────────────────────────────────────────
export async function verifyEmail(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { token } = req.query;

    if (!token) return errorResponse(res, 'Verification token required', 400);

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return errorResponse(res, 'Invalid or expired verification link', 400);
    }

    const user = db.prepare(`
      SELECT id, email_verification_token, is_email_verified
      FROM users WHERE id = ?
    `).get(decoded.id);

    if (!user) return errorResponse(res, 'User not found', 404);
    if (user.is_email_verified) return successResponse(res, {}, 'Email already verified');
    if (user.email_verification_token !== token) {
      return errorResponse(res, 'Invalid verification token', 400);
    }

    db.prepare(`
      UPDATE users SET is_email_verified = 1, email_verification_token = NULL,
      email_verification_expires = NULL WHERE id = ?
    `).run(user.id);

    return successResponse(res, {}, 'Email verified successfully');
  } catch (err) {
    next(err);
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
export async function forgotPassword(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { email } = req.body;

    const user = db.prepare('SELECT id, first_name FROM users WHERE email = ?').get(email.toLowerCase());

    // Always return success to avoid email enumeration
    if (!user) {
      return successResponse(res, {}, 'If your email is registered, you will receive a reset link.');
    }

    const resetToken = generatePasswordResetToken({ id: user.id });
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    db.prepare(`
      UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?
    `).run(resetToken, resetExpires, user.id);

    sendPasswordResetEmail(email, user.first_name, resetToken).catch(console.error);

    return successResponse(res, {}, 'If your email is registered, you will receive a reset link.');
  } catch (err) {
    next(err);
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────
export async function resetPassword(req, res, next) {
  try {
    const db = getSQLiteDB();
    const { token, newPassword } = req.body;

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return errorResponse(res, 'Invalid or expired reset token', 400);
    }

    const user = db.prepare(`
      SELECT id, email, first_name, password_reset_token, password_reset_expires
      FROM users WHERE id = ?
    `).get(decoded.id);

    if (!user || user.password_reset_token !== token) {
      return errorResponse(res, 'Invalid or expired reset token', 400);
    }

    if (new Date(user.password_reset_expires) < new Date()) {
      return errorResponse(res, 'Reset token has expired', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    db.prepare(`
      UPDATE users SET password_hash = ?, password_reset_token = NULL,
      password_reset_expires = NULL WHERE id = ?
    `).run(passwordHash, user.id);

    // Invalidate all refresh tokens
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(user.id);

    return successResponse(res, {}, 'Password reset successful. Please login.');
  } catch (err) {
    next(err);
  }
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export async function getMe(req, res) {
  const db = getSQLiteDB();
  const user = db.prepare(`
    SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.flat_number,
           u.tower, u.society_id, u.avatar_url, u.is_email_verified,
           u.last_login, u.created_at, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `).get(req.user.id);

  return successResponse(res, {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    role: user.role,
    flatNumber: user.flat_number,
    tower: user.tower,
    societyId: user.society_id,
    avatarUrl: user.avatar_url,
    isEmailVerified: Boolean(user.is_email_verified),
    lastLogin: user.last_login,
    createdAt: user.created_at,
  });
}
