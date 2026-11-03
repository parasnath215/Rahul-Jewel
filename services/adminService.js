// services/adminService.js
// Rahul Jewellers Legacy - Showroom Admin Management Service
// Handles form inquiries persistence, live gold rate management & override configuration

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const RATES_CONFIG_FILE = path.join(DATA_DIR, 'rates_config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Secret for admin session token HMAC
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'rahul_jewellers_legacy_secret_key_1989';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'rahul1989';

// Default initial rate config
const DEFAULT_RATES_CONFIG = {
  mode: 'auto', // 'auto' (cron / live API) or 'manual' (showroom override)
  manualRates: {
    gold24k_1g: 12710,
    silver_1g: 161,
    platinum_1g: 7290,
    customDateDisplay: ''
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'system'
};

// Seed inquiries if file does not exist
const INITIAL_INQUIRIES = [
  {
    id: 'RJ-INQ-1001',
    name: 'Chitransh Srivastava',
    phone: '+91 96169 05999',
    email: 'chitransh.srivastava@gmail.com',
    source: 'Contact Page Inquiry',
    productTitle: 'Bespoke Polki Bridal Suite',
    message: 'We are planning an heirloom bridal polki choker for our upcoming wedding in Hazratganj. Requesting a private concierge consultation.',
    status: 'converted',
    notes: 'Visited showroom on 1st Nov. Choker bespoke design confirmed with hallmarked 916 gold.',
    createdAt: '2026-11-01T11:30:00.000Z',
    dateDisplay: '01 Nov 2026, 11:30 AM'
  },
  {
    id: 'RJ-INQ-1002',
    name: 'Dr. Rashmi Verma',
    phone: '+91 98390 12345',
    email: 'dr.rashmi.verma@yahoo.co.in',
    source: 'Product Quick Inquiry',
    productTitle: 'The Royal Noor Heritage Choker',
    message: 'Interested in the certified diamond weight and current gold rate making charges for this piece.',
    status: 'contacted',
    notes: 'Shared certified dossiers via WhatsApp. Requested showroom visit this Saturday.',
    createdAt: '2026-11-02T15:45:00.000Z',
    dateDisplay: '02 Nov 2026, 03:45 PM'
  },
  {
    id: 'RJ-INQ-1003',
    name: 'Aditya Narayan Mehrotra',
    phone: '+91 94150 98765',
    email: 'aditya.mehrotra@outlook.com',
    source: 'Swarn Sanchay Scheme Inquiry',
    productTitle: 'Swarn Sanchay Monthly Gold Purchase',
    message: 'Would like details on the 11-month gold advance purchase scheme and bonus savings on 24K bullion.',
    status: 'new',
    notes: 'Pending follow-up by senior bullion consultant.',
    createdAt: '2026-11-03T18:20:00.000Z',
    dateDisplay: '03 Nov 2026, 06:20 PM'
  }
];

// Initialize persistent storage files
function initStorage() {
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(INITIAL_INQUIRIES, null, 2), 'utf-8');
  }
  if (!fs.existsSync(RATES_CONFIG_FILE)) {
    fs.writeFileSync(RATES_CONFIG_FILE, JSON.stringify(DEFAULT_RATES_CONFIG, null, 2), 'utf-8');
  }
}
initStorage();

// Read inquiries from JSON
function readInquiries() {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) return INITIAL_INQUIRIES;
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[ADMIN SERVICE] Error reading inquiries:', err);
    return [];
  }
}

// Write inquiries to JSON
function writeInquiries(inquiries) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[ADMIN SERVICE] Error writing inquiries:', err);
    return false;
  }
}

// Read rates config
function readRateConfig() {
  try {
    if (!fs.existsSync(RATES_CONFIG_FILE)) return DEFAULT_RATES_CONFIG;
    const data = fs.readFileSync(RATES_CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[ADMIN SERVICE] Error reading rate config:', err);
    return DEFAULT_RATES_CONFIG;
  }
}

// Write rates config
function writeRateConfig(config) {
  try {
    fs.writeFileSync(RATES_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[ADMIN SERVICE] Error writing rate config:', err);
    return false;
  }
}

// Format IST date string
function formatIST(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const y = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hStr = String(hours).padStart(2, '0');
  return `${d} ${month} ${y}, ${hStr}:${minutes} ${ampm}`;
}

// Public API
module.exports = {
  // Authentication
  verifyCredentials(username, password) {
    return username === ADMIN_USER && password === ADMIN_PASS;
  },

  createSessionToken() {
    const timestamp = Date.now();
    const payload = `${ADMIN_USER}:${timestamp}`;
    const hash = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
    return `${Buffer.from(payload).toString('base64')}.${hash}`;
  },

  validateSessionToken(token) {
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return false;
      const payload = Buffer.from(parts[0], 'base64').toString('utf-8');
      const expectedHash = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
      if (expectedHash !== parts[1]) return false;
      
      const [user, timestamp] = payload.split(':');
      if (user !== ADMIN_USER) return false;
      // 7-day token expiration
      const age = Date.now() - parseInt(timestamp, 10);
      return age < 7 * 24 * 60 * 60 * 1000;
    } catch (e) {
      return false;
    }
  },

  // Inquiries Management
  getInquiries({ status, search } = {}) {
    let list = readInquiries();
    if (status && status !== 'all') {
      list = list.filter(item => (item.status || '').toLowerCase() === status.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(item => 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.productTitle && item.productTitle.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q))
      );
    }
    // Return sorted newest first
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getInquiryById(id) {
    const list = readInquiries();
    return list.find(item => item.id === id) || null;
  },

  createInquiry({ name, phone, email, source, productTitle, message }) {
    const list = readInquiries();
    const now = new Date();
    const id = `RJ-INQ-${Date.now().toString().slice(-4)}`;
    
    const newRecord = {
      id,
      name: (name || '').trim() || 'Valued Patron',
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      source: source || 'Website Enquiry',
      productTitle: productTitle || 'General Showroom Collection',
      message: (message || '').trim(),
      status: 'new',
      notes: '',
      createdAt: now.toISOString(),
      dateDisplay: formatIST(now)
    };

    list.unshift(newRecord);
    writeInquiries(list);
    return newRecord;
  },

  updateInquiry(id, updates) {
    const list = readInquiries();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    if (updates.status !== undefined) list[idx].status = updates.status;
    if (updates.notes !== undefined) list[idx].notes = updates.notes;
    if (updates.name !== undefined) list[idx].name = updates.name;
    if (updates.phone !== undefined) list[idx].phone = updates.phone;
    if (updates.email !== undefined) list[idx].email = updates.email;

    list[idx].updatedAt = new Date().toISOString();
    writeInquiries(list);
    return list[idx];
  },

  deleteInquiry(id) {
    let list = readInquiries();
    const initialLen = list.length;
    list = list.filter(item => item.id !== id);
    if (list.length !== initialLen) {
      writeInquiries(list);
      return true;
    }
    return false;
  },

  // Rates Management
  getRateConfig() {
    return readRateConfig();
  },

  setRateConfig({ mode, gold24k_1g, silver_1g, platinum_1g, customDateDisplay, updatedBy = 'admin' }) {
    const current = readRateConfig();
    const updated = {
      ...current,
      mode: mode || current.mode || 'auto',
      manualRates: {
        gold24k_1g: gold24k_1g !== undefined ? Number(gold24k_1g) : current.manualRates.gold24k_1g,
        silver_1g: silver_1g !== undefined ? Number(silver_1g) : current.manualRates.silver_1g,
        platinum_1g: platinum_1g !== undefined ? Number(platinum_1g) : current.manualRates.platinum_1g,
        customDateDisplay: customDateDisplay !== undefined ? customDateDisplay : current.manualRates.customDateDisplay
      },
      updatedAt: new Date().toISOString(),
      updatedBy
    };
    writeRateConfig(updated);
    return updated;
  }
};
