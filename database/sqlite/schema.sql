-- Smart Society Hub — SQLite3 Schema Reference
-- (Actual schema is auto-created by server/src/config/db.sqlite.js)

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,          -- resident | committee | security | maintenance | vendor
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,           -- e.g. visitors:invite
  description TEXT,
  module TEXT NOT NULL,                -- auth | visitors | complaints | billing | ...
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Role ↔ Permission mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                       -- UUID
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role_id INTEGER NOT NULL,
  flat_number TEXT,
  tower TEXT,
  society_id TEXT,
  avatar_url TEXT,
  is_active INTEGER DEFAULT 1,
  is_email_verified INTEGER DEFAULT 0,
  email_verification_token TEXT,
  email_verification_expires DATETIME,
  password_reset_token TEXT,
  password_reset_expires DATETIME,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
