// Node.js v22+ built-in SQLite (no external package needed)
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

export function getSQLiteDB() {
  if (!db) throw new Error('SQLite not initialized. Call initSQLite() first.');
  return db;
}

export async function initSQLite() {
  const dbPath = process.env.SQLITE_DB_PATH
    ? path.resolve(process.env.SQLITE_DB_PATH)
    : path.resolve(__dirname, '../../../database/smart_society.db');

  // Ensure directory exists
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);

  // Enable WAL mode and foreign keys
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');

  // ─── Schema ───────────────────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO roles (name, description) VALUES
      ('resident', 'Society resident with standard access'),
      ('committee', 'Committee member with management access'),
      ('security', 'Security guard with gate management access'),
      ('maintenance', 'Maintenance staff with task management access'),
      ('vendor', 'External vendor with service request access');

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      module TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INTEGER NOT NULL,
      permission_id INTEGER NOT NULL,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
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

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TRIGGER IF NOT EXISTS update_users_updated_at
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
  `);

  insertDefaultPermissions();

  console.log('✅ SQLite initialized:', dbPath);
}

function insertDefaultPermissions() {
  const permissions = [
    { name: 'auth:login', description: 'Can login', module: 'auth' },
    { name: 'auth:register', description: 'Can register', module: 'auth' },
    { name: 'visitors:invite', description: 'Can invite visitors', module: 'visitors' },
    { name: 'visitors:approve', description: 'Can approve visitors', module: 'visitors' },
    { name: 'visitors:scan', description: 'Can scan visitor QR', module: 'visitors' },
    { name: 'visitors:view_logs', description: 'Can view visitor logs', module: 'visitors' },
    { name: 'complaints:create', description: 'Can raise a complaint', module: 'complaints' },
    { name: 'complaints:manage', description: 'Can assign/manage complaints', module: 'complaints' },
    { name: 'complaints:update_status', description: 'Can update complaint status', module: 'complaints' },
    { name: 'billing:view', description: 'Can view own bills', module: 'billing' },
    { name: 'billing:manage', description: 'Can manage all bills', module: 'billing' },
    { name: 'billing:pay', description: 'Can pay bills', module: 'billing' },
    { name: 'parking:manage', description: 'Can manage parking', module: 'parking' },
    { name: 'parking:view', description: 'Can view parking', module: 'parking' },
    { name: 'facilities:book', description: 'Can book facilities', module: 'facilities' },
    { name: 'facilities:approve', description: 'Can approve bookings', module: 'facilities' },
    { name: 'notices:create', description: 'Can create notices', module: 'notices' },
    { name: 'notices:view', description: 'Can view notices', module: 'notices' },
    { name: 'polls:create', description: 'Can create polls', module: 'polls' },
    { name: 'polls:vote', description: 'Can vote in polls', module: 'polls' },
    { name: 'events:create', description: 'Can create events', module: 'events' },
    { name: 'events:rsvp', description: 'Can RSVP to events', module: 'events' },
    { name: 'security:incidents', description: 'Can create security incidents', module: 'security' },
    { name: 'security:sos', description: 'Can trigger SOS', module: 'security' },
    { name: 'analytics:view', description: 'Can view analytics', module: 'analytics' },
    { name: 'users:manage', description: 'Can manage users', module: 'users' },
    { name: 'users:approve', description: 'Can approve residents', module: 'users' },
  ];

  const insert = db.prepare('INSERT OR IGNORE INTO permissions (name, description, module) VALUES (?, ?, ?)');
  for (const p of permissions) {
    insert.run(p.name, p.description, p.module);
  }
}
