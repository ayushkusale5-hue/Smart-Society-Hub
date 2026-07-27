/**
 * Auth service backed by localStorage
 * No backend required — register/login/logout all operate on localStorage
 */
import { db, COLLECTIONS } from './storage.service.js';

const SESSION_KEY = 'ssh_session';

// Simple password "hashing" for localStorage context
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}`;
}

function verifyPassword(plain, hashed) {
  return simpleHash(plain) === hashed;
}

export const authService = {
  /**
   * Register a new user
   */
  register(data) {
    const { email, password, firstName, lastName, phone, role, flatNumber, tower, societyId } = data;

    // Check duplicate email
    const existing = db.findOne(COLLECTIONS.USERS, { email: email.toLowerCase() });
    if (existing) {
      return Promise.reject({ response: { data: { message: 'Email already registered' } } });
    }

    const user = db.create(COLLECTIONS.USERS, {
      email: email.toLowerCase(),
      passwordHash: simpleHash(password),
      firstName,
      lastName,
      phone: phone || '',
      role: role || 'resident',
      flatNumber: flatNumber || '',
      tower: tower || '',
      societyId: societyId || 'default',
      avatarUrl: null,
      isActive: true,
      isEmailVerified: true, // Auto-verify in localStorage mode
    });

    return Promise.resolve({
      data: { success: true, message: 'Account created successfully!', data: { userId: user.id } },
    });
  },

  /**
   * Login with email + password
   */
  login(data) {
    const { email, password } = data;

    const user = db.findOne(COLLECTIONS.USERS, { email: email.toLowerCase() });

    if (!user) {
      return Promise.reject({ response: { data: { message: 'Invalid email or password' } } });
    }

    if (!user.isActive) {
      return Promise.reject({ response: { data: { message: 'Account is deactivated. Contact committee.' } } });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return Promise.reject({ response: { data: { message: 'Invalid email or password' } } });
    }

    // Update last login
    db.update(COLLECTIONS.USERS, user.id, { lastLogin: new Date().toISOString() });

    // Create session token (simple)
    const token = `tok_${user.id}_${Date.now()}`;
    const sessionData = {
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    const safeUser = _sanitizeUser(user);

    return Promise.resolve({
      data: {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: token,
          refreshToken: token, // Same in localStorage mode
          user: safeUser,
        },
      },
    });
  },

  /**
   * Get current logged-in user
   */
  getMe() {
    const session = _getSession();
    if (!session) {
      return Promise.reject({ response: { data: { message: 'Not authenticated' }, status: 401 } });
    }
    const user = db.findById(COLLECTIONS.USERS, session.userId);
    if (!user) {
      return Promise.reject({ response: { data: { message: 'User not found' }, status: 401 } });
    }
    return Promise.resolve({
      data: { success: true, data: _sanitizeUser(user) },
    });
  },

  /**
   * Logout — clears session
   */
  logout() {
    localStorage.removeItem(SESSION_KEY);
    return Promise.resolve({ data: { success: true, message: 'Logged out' } });
  },

  /**
   * Refresh token — always valid in localStorage mode
   */
  refreshToken() {
    const session = _getSession();
    if (!session) {
      return Promise.reject({ response: { data: { message: 'Session expired' }, status: 401 } });
    }
    return Promise.resolve({
      data: { success: true, data: { accessToken: session.token } },
    });
  },

  /**
   * Forgot password — in localStorage mode, directly shows reset link (simulation)
   */
  forgotPassword(email) {
    // In localStorage mode, we just verify the email exists
    const user = db.findOne(COLLECTIONS.USERS, { email: email.toLowerCase() });
    // Always return success (security best practice)
    return Promise.resolve({ data: { success: true, message: 'Reset link sent (check your console in dev mode)' } });
  },

  /**
   * Reset password using token
   */
  resetPassword(token, newPassword) {
    // In localStorage mode, decode userId from token
    const parts = token.split('_');
    if (parts.length < 2) {
      return Promise.reject({ response: { data: { message: 'Invalid token' } } });
    }
    const userId = parts[1];
    db.update(COLLECTIONS.USERS, userId, { passwordHash: simpleHash(newPassword) });
    return Promise.resolve({ data: { success: true, message: 'Password reset successfully' } });
  },

  verifyEmail(token) {
    return Promise.resolve({ data: { success: true } });
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────

function _getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function _sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}
