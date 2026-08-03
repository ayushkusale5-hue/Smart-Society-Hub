
 * Smart Society Hub — localStorage Data Service
 * Replaces MongoDB + SQLite with browser localStorage
 * All data is stored in organized namespaced keys.
 */

const PREFIX = 'ssh_';



function getKey(collection) {
  return `${PREFIX}${collection}`;
}

function readAll(collection) {
  try {
    const raw = localStorage.getItem(getKey(collection));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(collection, data) {
  localStorage.setItem(getKey(collection), JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function now() {
  return new Date().toISOString();
}



export const db = {
  
  findAll(collection, filter = {}) {
    const data = readAll(collection);
    if (Object.keys(filter).length === 0) return data;
    return data.filter((item) =>
      Object.entries(filter).every(([k, v]) => item[k] === v)
    );
  },

  
  findOne(collection, filter = {}) {
    const data = readAll(collection);
    return data.find((item) =>
      Object.entries(filter).every(([k, v]) => item[k] === v)
    ) || null;
  },

  
  findById(collection, id) {
    return this.findOne(collection, { id });
  },

  
  create(collection, data) {
    const records = readAll(collection);
    const newRecord = {
      id: data.id || generateId(),
      ...data,
      createdAt: now(),
      updatedAt: now(),
    };
    records.push(newRecord);
    writeAll(collection, records);
    return newRecord;
  },

  
  update(collection, id, updates) {
    const records = readAll(collection);
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    records[idx] = { ...records[idx], ...updates, updatedAt: now() };
    writeAll(collection, records);
    return records[idx];
  },

  
  delete(collection, id) {
    const records = readAll(collection);
    const filtered = records.filter((r) => r.id !== id);
    writeAll(collection, filtered);
    return filtered.length < records.length;
  },

  
  deleteMany(collection, filter = {}) {
    const records = readAll(collection);
    const filtered = records.filter(
      (item) => !Object.entries(filter).every(([k, v]) => item[k] === v)
    );
    writeAll(collection, filtered);
  },

  
  count(collection, filter = {}) {
    return this.findAll(collection, filter).length;
  },

  
  paginate(collection, filter = {}, { page = 1, limit = 20, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    let data = this.findAll(collection, filter);
    
    data.sort((a, b) => {
      const va = a[sortBy]; const vb = b[sortBy];
      if (!va) return 1; if (!vb) return -1;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    const total = data.length;
    const start = (page - 1) * limit;
    const items = data.slice(start, start + limit);
    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: start + limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  
  clear(collection) {
    localStorage.removeItem(getKey(collection));
  },

  
  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};



export function seedInitialData() {
  
  if (db.findAll('users').length > 0) return;

  
  const facilities = [
    { name: 'Club House', type: 'clubhouse', description: 'Multi-purpose event hall', capacity: 200, pricePerHour: 500, operatingHours: { open: '08:00', close: '22:00' }, isActive: true },
    { name: 'Gymnasium', type: 'gym', description: 'Fully equipped modern gym', capacity: 30, pricePerHour: 0, operatingHours: { open: '05:00', close: '22:00' }, isActive: true },
    { name: 'Swimming Pool', type: 'swimming_pool', description: 'Olympic-size pool', capacity: 50, pricePerHour: 100, operatingHours: { open: '06:00', close: '20:00' }, isActive: true },
    { name: 'Banquet Hall', type: 'hall', description: 'Elegant hall for celebrations', capacity: 150, pricePerHour: 1000, operatingHours: { open: '09:00', close: '23:00' }, isActive: true },
    { name: 'Tennis Court', type: 'tennis_court', description: 'Professional tennis court', capacity: 4, pricePerHour: 200, operatingHours: { open: '06:00', close: '21:00' }, isActive: true },
  ];
  facilities.forEach((f) => db.create('facilities', { ...f, societyId: 'default' }));

  
  db.create('notices', {
    societyId: 'default',
    title: 'Welcome to Smart Society Hub!',
    content: 'We are excited to launch our new digital society management platform. You can now manage visitors, complaints, facilities, and much more from this portal.',
    type: 'general',
    priority: 'normal',
    isPinned: true,
    createdBy: 'system',
    viewedBy: [],
  });

  console.log('✅ Initial data seeded to localStorage');
}


export const COLLECTIONS = {
  USERS:         'users',
  VISITORS:      'visitors',
  COMPLAINTS:    'complaints',
  NOTICES:       'notices',
  NOTIFICATIONS: 'notifications',
  POLLS:         'polls',
  MARKETPLACE:   'marketplace',
  EVENTS:        'events',
  FACILITIES:    'facilities',
  BOOKINGS:      'bookings',
  CHAT:          'chat_messages',
  PARKING:       'parking_slots',
  BILLING:       'billing',
  INCIDENTS:     'incidents',
  LOST_FOUND:    'lost_found',
};
