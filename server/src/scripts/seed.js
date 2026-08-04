import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { initSQLite, getSQLiteDB } from '../config/db.sqlite.js';
import { connectMongo } from '../config/db.mongo.js';
import { Complaint } from '../models/mongo/Complaint.js';
import { Visitor } from '../models/mongo/Visitor.js';
import { Incident } from '../models/mongo/Incident.js';
import { VehicleLog } from '../models/mongo/VehicleLog.js';
import { SosAlert } from '../models/mongo/SosAlert.js';
import { Event } from '../models/mongo/Event.js';
import { LostFound } from '../models/mongo/LostFound.js';

async function seedData() {
  console.log('🌱 Starting database seeding...');

  try {
    await initSQLite();
    const db = getSQLiteDB();
    await connectMongo();

    // 1. CLEAR COLLECTIONS
    await Complaint.deleteMany({});
    await Visitor.deleteMany({});
    await Incident.deleteMany({});
    await VehicleLog.deleteMany({});
    await SosAlert.deleteMany({});
    await Event.deleteMany({});
    await LostFound.deleteMany({});
    console.log('✅ Cleared existing MongoDB collections.');

    db.exec(`DELETE FROM users;`);
    console.log('✅ Cleared existing SQLite users.');

    // 2. CREATE ROLES
    const roles = {
      resident: db.prepare("SELECT id FROM roles WHERE name = 'resident'").get()?.id,
      committee: db.prepare("SELECT id FROM roles WHERE name = 'committee'").get()?.id,
      security: db.prepare("SELECT id FROM roles WHERE name = 'security'").get()?.id,
      maintenance: db.prepare("SELECT id FROM roles WHERE name = 'maintenance'").get()?.id,
      vendor: db.prepare("SELECT id FROM roles WHERE name = 'vendor'").get()?.id,
    };
    if (!roles.resident) throw new Error('Roles missing in DB');

    // 3. CREATE USERS
    const passwordHash = await bcrypt.hash('Password@123', 10);
    const usersToCreate = [
      { email: 'admin@society.com', fname: 'Admin', lname: 'User', role: roles.committee, flat: 'Admin-01' },
      { email: 'resident@society.com', fname: 'John', lname: 'Doe', role: roles.resident, flat: 'A-101' },
      { email: 'security@society.com', fname: 'Guard', lname: 'Singh', role: roles.security, flat: 'Gate-1' },
      { email: 'maintenance@society.com', fname: 'Fixit', lname: 'Team', role: roles.maintenance, flat: 'Maintenance-1' },
      { email: 'vendor@society.com', fname: 'Vendor', lname: 'Services', role: roles.vendor, flat: 'Vendor-1' },
    ];

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role_id, flat_number, tower, is_active, is_email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Tower A', 1, 1)
    `);

    const createdUsers = {};
    for (const u of usersToCreate) {
      const id = uuidv4();
      insertUser.run(id, u.email, passwordHash, u.fname, u.lname, u.role, u.flat);
      createdUsers[u.email] = { id, name: `${u.fname} ${u.lname}` };
      console.log(`👤 Created user: ${u.email} (Password: Password@123)`);
    }

    const resId = createdUsers['resident@society.com'].id;
    const resName = createdUsers['resident@society.com'].name;
    const adminId = createdUsers['admin@society.com'].id;
    const adminName = createdUsers['admin@society.com'].name;
    const secId = createdUsers['security@society.com'].id;
    const secName = createdUsers['security@society.com'].name;
    const maintId = createdUsers['maintenance@society.com'].id;

    // 4. SEED MONGODB DATA
    // Complaints
    await Complaint.create([
      { title: 'Leaking Pipe', description: 'Kitchen sink pipe is leaking', category: 'Plumbing', priority: 'Medium', status: 'Pending', residentId: resId },
      { title: 'AC not working', description: 'AC not cooling', category: 'Electrical', priority: 'High', status: 'In Progress', residentId: resId, assignedTo: maintId },
      { title: 'Broken Window', description: 'Living room window broken', category: 'Carpentry', priority: 'Low', status: 'Resolved', residentId: resId },
    ]);

    // Visitors
    await Visitor.create([
      { name: 'Alice Smith', phone: '1234567890', purpose: 'Guest', expectedArrival: new Date(), hostId: resId, hostName: resName, flatNumber: 'A-101', tower: 'Tower A', status: 'Expected' },
      { name: 'Bob Delivery', phone: '0987654321', purpose: 'Delivery', expectedArrival: new Date(), actualEntry: new Date(), hostId: resId, hostName: resName, flatNumber: 'A-101', tower: 'Tower A', status: 'Inside' },
    ]);

    // Incidents
    await Incident.create([
      { title: 'Suspicious Person', description: 'Unknown person near gate', category: 'Suspicious Activity', priority: 'Medium', status: 'Open', reportedBy: secId, reportedByName: secName },
      { title: 'Fire alarm ringing', description: 'Block B alarm ringing', category: 'Fire', priority: 'Critical', status: 'Resolved', reportedBy: secId, reportedByName: secName },
    ]);

    // Vehicle Logs
    await VehicleLog.create([
      { vehicleNumber: 'MH12AB1234', vehicleType: 'Car', driverName: 'John', purpose: 'Resident', flatNumber: 'A-101', loggedBy: secId, loggedByName: secName, entryTime: new Date(Date.now() - 3600000) },
      { vehicleNumber: 'DL01CD5678', vehicleType: 'Bike', driverName: 'Delivery', purpose: 'Delivery', flatNumber: 'A-102', loggedBy: secId, loggedByName: secName, entryTime: new Date(Date.now() - 7200000), exitTime: new Date(Date.now() - 3600000) },
    ]);

    // SOS Alerts
    await SosAlert.create([
      { triggeredBy: resId, triggeredByName: resName, type: 'Medical', message: 'Heart attack', status: 'Active' },
      { triggeredBy: resId, triggeredByName: resName, type: 'Fire', message: 'Kitchen fire', status: 'Resolved', resolvedBy: secId, resolvedByName: secName, resolvedAt: new Date() },
    ]);

    // Events
    await Event.create([
      { title: 'Diwali Party', description: 'Annual Diwali Celebration', date: new Date(Date.now() + 86400000 * 5), time: '18:00', venue: 'Clubhouse', category: 'Festival', createdBy: adminId, createdByName: adminName },
      { title: 'Society Meeting', description: 'Monthly general body meeting', date: new Date(Date.now() + 86400000 * 2), time: '10:00', venue: 'Meeting Room', category: 'Meeting', createdBy: adminId, createdByName: adminName },
    ]);

    // Lost & Found
    await LostFound.create([
      { title: 'Lost Keys', description: 'Bunch of 3 keys with blue keychain', type: 'Lost', category: 'Keys', reportedBy: resId, reportedByName: resName, status: 'Active' },
      { title: 'Found Watch', description: 'Silver analog watch near gym', type: 'Found', category: 'Other', reportedBy: secId, reportedByName: secName, status: 'Active' },
    ]);

    console.log('✅ MongoDB data seeded successfully.');
    console.log('🎉 Seeding complete!');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seedData();
