const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { initDb } = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-prod';
const REFERRAL_JWT_SECRET = process.env.REFERRAL_JWT_SECRET || JWT_SECRET;

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const LEADS_FROM_EMAIL = process.env.LEADS_FROM_EMAIL || SMTP_USER || '';
const LEADS_NOTIFY_EMAIL = process.env.LEADS_NOTIFY_EMAIL || '';

const mailTransport = SMTP_HOST && SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  : null;

async function sendMail({ to, subject, text }) {
  if (!mailTransport || !LEADS_FROM_EMAIL) return { sent: false, skipped: true };
  await mailTransport.sendMail({
    from: LEADS_FROM_EMAIL,
    to,
    subject,
    text
  });
  return { sent: true };
}

function nowIso() {
  return new Date().toISOString();
}

function addHoursIso(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

const authenticateReferral = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, REFERRAL_JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.referralUser = user;
    next();
  });
};

async function processDueLeadEvents() {
  const db = await initDb();
  const due = await db.all(
    `SELECT * FROM lead_events
     WHERE status = 'scheduled' AND (scheduled_at IS NULL OR scheduled_at <= ?)
     ORDER BY id ASC
     LIMIT 50`,
    nowIso()
  );

  for (const ev of due) {
    try {
      if (!ev.to_email) {
        await db.run(`UPDATE lead_events SET status = 'skipped', sent_at = ?, error = ? WHERE id = ?`, nowIso(), 'missing_to', ev.id);
        continue;
      }
      await sendMail({ to: ev.to_email, subject: ev.subject || '', text: ev.body || '' });
      await db.run(`UPDATE lead_events SET status = 'sent', sent_at = ? WHERE id = ?`, nowIso(), ev.id);
    } catch (e) {
      await db.run(`UPDATE lead_events SET status = 'failed', error = ? WHERE id = ?`, String(e && e.message ? e.message : e), ev.id);
    }
  }
}

setInterval(() => {
  processDueLeadEvents().catch(() => {});
}, 60 * 1000);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif|mp4|webm|mov|ogg/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (ext && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '200mb' })); // Increased limit for Base64 videos
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Initialize DB
initDb().catch(console.error);

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Authentication key required' });
    }

    const db = await initDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', 'admin');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(key, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid authentication key' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Authentication successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.post('/api/leads', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      budget_range,
      problem,
      preferred_contact_time,
      source,
      referral_code
    } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = await initDb();

    const result = await db.run(
      `INSERT INTO leads (name, email, phone, company, budget_range, problem, preferred_contact_time, source, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      String(name).trim(),
      String(email).trim(),
      phone ? String(phone).trim() : '',
      company ? String(company).trim() : '',
      budget_range ? String(budget_range).trim() : '',
      problem ? String(problem).trim() : '',
      preferred_contact_time ? String(preferred_contact_time).trim() : '',
      source ? String(source).trim() : 'website'
    );

    const leadId = result.lastID;

    if (referral_code && String(referral_code).trim()) {
      const code = String(referral_code).trim();
      const dbUser = await db.get(`SELECT id, commission_rate FROM referral_users WHERE referral_code = ?`, code);
      if (dbUser) {
        const rate = typeof dbUser.commission_rate === 'number' ? dbUser.commission_rate : 0.1;
        const commissionAmount = null;
        await db.run(
          `INSERT INTO referral_conversions (referral_code, lead_id, amount, currency, commission_amount, status, created_at)
           VALUES (?, ?, ?, ?, ?, 'lead', CURRENT_TIMESTAMP)`,
          code,
          leadId,
          null,
          null,
          commissionAmount
        );
      }
    }

    const thankYouSubject = 'We received your request';
    const thankYouBody =
      `Hi ${String(name).trim()},\n\n` +
      `Thanks for reaching out. We received your request and we will contact you within 24 hours.\n\n` +
      `If you have any additional details to share, reply to this email.\n\n` +
      `— Niche`;

    await db.run(
      `INSERT INTO lead_events (lead_id, type, to_email, subject, body, status, scheduled_at)
       VALUES (?, 'email', ?, ?, ?, 'scheduled', ?)`,
      leadId,
      String(email).trim(),
      thankYouSubject,
      thankYouBody,
      nowIso()
    );

    if (LEADS_NOTIFY_EMAIL) {
      const notifySubject = `New lead: ${String(name).trim()}`;
      const notifyBody =
        `New lead received.\n\n` +
        `Name: ${String(name).trim()}\n` +
        `Email: ${String(email).trim()}\n` +
        `Phone: ${phone ? String(phone).trim() : ''}\n` +
        `Company: ${company ? String(company).trim() : ''}\n` +
        `Budget: ${budget_range ? String(budget_range).trim() : ''}\n` +
        `Preferred time: ${preferred_contact_time ? String(preferred_contact_time).trim() : ''}\n` +
        `Source: ${source ? String(source).trim() : 'website'}\n\n` +
        `Problem:\n${problem ? String(problem).trim() : ''}\n`;

      await db.run(
        `INSERT INTO lead_events (lead_id, type, to_email, subject, body, status, scheduled_at)
         VALUES (?, 'email', ?, ?, ?, 'scheduled', ?)`,
        leadId,
        LEADS_NOTIFY_EMAIL,
        notifySubject,
        notifyBody,
        nowIso()
      );

      const reminderSubject = `Follow up reminder: ${String(name).trim()}`;
      const reminderBody =
        `Reminder: follow up with lead within 24 hours.\n\n` +
        `Name: ${String(name).trim()}\n` +
        `Email: ${String(email).trim()}\n` +
        `Phone: ${phone ? String(phone).trim() : ''}\n`;

      await db.run(
        `INSERT INTO lead_events (lead_id, type, to_email, subject, body, status, scheduled_at)
         VALUES (?, 'email', ?, ?, ?, 'scheduled', ?)`,
        leadId,
        LEADS_NOTIFY_EMAIL,
        reminderSubject,
        reminderBody,
        addHoursIso(24)
      );
    }

    processDueLeadEvents().catch(() => {});

    res.json({ success: true, id: leadId });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const db = await initDb();
    const leads = await db.all(`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`);
    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/leads/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!status || typeof status !== 'string') return res.status(400).json({ error: 'Status required' });
    const db = await initDb();
    await db.run(`UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/leads/process-events', authenticateToken, async (req, res) => {
  try {
    await processDueLeadEvents();
    res.json({ success: true });
  } catch (error) {
    console.error('Process lead events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/referrals/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const db = await initDb();
    const existing = await db.get(`SELECT id FROM referral_users WHERE email = ?`, String(email).trim());
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(String(password), salt);
    let code;
    for (;;) {
      code = crypto.randomBytes(4).toString('hex');
      const taken = await db.get(`SELECT id FROM referral_users WHERE referral_code = ?`, code);
      if (!taken) break;
    }
    const result = await db.run(
      `INSERT INTO referral_users (name, email, role, password_hash, referral_code, commission_rate, created_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      name ? String(name).trim() : '',
      String(email).trim(),
      role ? String(role).trim() : 'creator',
      hash,
      code,
      0.1
    );
    const id = result.lastID;
    const token = jwt.sign({ id, email: String(email).trim(), referral_code: code }, REFERRAL_JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, referral_code: code });
  } catch (error) {
    console.error('Referral register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/referrals/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const db = await initDb();
    const user = await db.get(`SELECT * FROM referral_users WHERE email = ?`, String(email).trim());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, referral_code: user.referral_code }, REFERRAL_JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, referral_code: user.referral_code });
  } catch (error) {
    console.error('Referral login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/referrals/me', authenticateReferral, async (req, res) => {
  try {
    const db = await initDb();
    const user = await db.get(
      `SELECT id, name, email, role, referral_code, commission_rate, created_at FROM referral_users WHERE id = ?`,
      req.referralUser.id
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Referral me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/referrals/stats', authenticateReferral, async (req, res) => {
  try {
    const db = await initDb();
    const user = await db.get(`SELECT referral_code, commission_rate FROM referral_users WHERE id = ?`, req.referralUser.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const code = user.referral_code;
    const clicksRow = await db.get(
      `SELECT COUNT(*) as count FROM referral_clicks WHERE referral_code = ?`,
      code
    );
    const convRow = await db.get(
      `SELECT COUNT(*) as count FROM referral_conversions WHERE referral_code = ?`,
      code
    );
    const earningsRow = await db.get(
      `SELECT COALESCE(SUM(commission_amount),0) as total FROM referral_conversions WHERE referral_code = ?`,
      code
    );
    const clicksByPath = await db.all(
      `SELECT path, COUNT(*) as count FROM referral_clicks WHERE referral_code = ? GROUP BY path`,
      code
    );
    const recentConversions = await db.all(
      `SELECT id, lead_id, amount, currency, commission_amount, status, created_at
       FROM referral_conversions
       WHERE referral_code = ?
       ORDER BY created_at DESC
       LIMIT 20`,
      code
    );
    res.json({
      referral_code: code,
      clicks: clicksRow ? clicksRow.count : 0,
      conversions: convRow ? convRow.count : 0,
      earnings: earningsRow ? earningsRow.total : 0,
      commission_rate: user.commission_rate,
      recent_conversions: recentConversions,
      clicks_by_path: clicksByPath
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/referrals/track-click', async (req, res) => {
  try {
    const { code, path } = req.body || {};
    if (!code) return res.status(400).json({ error: 'Code required' });
    const db = await initDb();
    const exists = await db.get(`SELECT id FROM referral_users WHERE referral_code = ?`, String(code).trim());
    if (!exists) return res.status(404).json({ error: 'Code not found' });
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ua = req.headers['user-agent'] || '';
    await db.run(
      `INSERT INTO referral_clicks (referral_code, ip, user_agent, path, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      String(code).trim(),
      Array.isArray(ip) ? ip.join(',') : String(ip),
      String(ua),
      path ? String(path).trim() : null
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Referral click error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/referrals/track-conversion', authenticateToken, async (req, res) => {
  try {
    const { referral_code, lead_id, amount, currency, status } = req.body || {};
    if (!referral_code) return res.status(400).json({ error: 'Referral code required' });
    const db = await initDb();
    const user = await db.get(`SELECT commission_rate FROM referral_users WHERE referral_code = ?`, String(referral_code).trim());
    if (!user) return res.status(404).json({ error: 'Referral user not found' });
    const rate = typeof user.commission_rate === 'number' ? user.commission_rate : 0.1;
    const amt = typeof amount === 'number' ? amount : null;
    const commission = amt != null ? amt * rate : null;
    await db.run(
      `INSERT INTO referral_conversions (referral_code, lead_id, amount, currency, commission_amount, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      String(referral_code).trim(),
      typeof lead_id === 'number' ? lead_id : null,
      amt,
      currency ? String(currency).trim() : null,
      commission,
      status ? String(status).trim() : 'closed'
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Referral conversion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const db = await initDb();
    const { status } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const products = await db.all(query, ...params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const db = await initDb();
    const product = await db.get('SELECT * FROM products WHERE slug = ?', slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDb();
    const product = await db.get('SELECT * FROM products WHERE id = ?', id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const {
      slug,
      name,
      type,
      short_description,
      long_description,
      price_amount,
      price_currency,
      price_period,
      badge,
      is_featured,
      tags,
      includes,
      best_for,
      image,
      purchase_url,
      status,
      sort_order
    } = req.body || {};

    const db = await initDb();
    const existing = await db.get('SELECT id FROM products WHERE slug = ?', slug);
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const result = await db.run(
      `INSERT INTO products (
        slug,
        name,
        type,
        short_description,
        long_description,
        price_amount,
        price_currency,
        price_period,
        badge,
        is_featured,
        tags,
        includes,
        best_for,
        image,
        purchase_url,
        status,
        sort_order,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      slug,
      name,
      type,
      short_description,
      long_description,
      typeof price_amount === 'number' ? price_amount : null,
      price_currency,
      price_period,
      badge,
      is_featured ? 1 : 0,
      JSON.stringify(tags || []),
      JSON.stringify(includes || []),
      best_for,
      image,
      purchase_url,
      status || 'active',
      typeof sort_order === 'number' ? sort_order : 0
    );

    res.json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug,
      name,
      type,
      short_description,
      long_description,
      price_amount,
      price_currency,
      price_period,
      badge,
      is_featured,
      tags,
      includes,
      best_for,
      image,
      purchase_url,
      status,
      sort_order
    } = req.body || {};

    const db = await initDb();

    const existing = await db.get('SELECT id FROM products WHERE slug = ? AND id != ?', slug, id);
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    await db.run(
      `UPDATE products SET
        slug = ?,
        name = ?,
        type = ?,
        short_description = ?,
        long_description = ?,
        price_amount = ?,
        price_currency = ?,
        price_period = ?,
        badge = ?,
        is_featured = ?,
        tags = ?,
        includes = ?,
        best_for = ?,
        image = ?,
        purchase_url = ?,
        status = ?,
        sort_order = ?,
        created_at = created_at
      WHERE id = ?`,
      slug,
      name,
      type,
      short_description,
      long_description,
      typeof price_amount === 'number' ? price_amount : null,
      price_currency,
      price_period,
      badge,
      is_featured ? 1 : 0,
      JSON.stringify(tags || []),
      JSON.stringify(includes || []),
      best_for,
      image,
      purchase_url,
      status || 'active',
      typeof sort_order === 'number' ? sort_order : 0,
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDb();
    await db.run('DELETE FROM products WHERE id = ?', id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File Upload Route - converts to base64 and returns data URL
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file
    const filePath = path.join(uploadsDir, req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);

    // Convert to base64
    const base64Data = fileBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Delete the physical file after converting to base64
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      url: dataUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: mimeType
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete uploaded file
app.delete('/api/upload/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Configuration Routes
app.get('/api/config/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const db = await initDb();
    const config = await db.get('SELECT value FROM configurations WHERE key = ?', key);

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json(JSON.parse(config.value));
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/config/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const value = req.body;
    const db = await initDb();

    // Check if exists
    const existing = await db.get('SELECT key FROM configurations WHERE key = ?', key);

    if (existing) {
      await db.run('UPDATE configurations SET value = ? WHERE key = ?', JSON.stringify(value), key);
    } else {
      await db.run('INSERT INTO configurations (key, value) VALUES (?, ?)', key, JSON.stringify(value));
    }

    res.json({ success: true, message: 'Configuration updated' });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog Routes

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const db = await initDb();
    const blogs = await db.all('SELECT * FROM blogs ORDER BY published_date DESC');
    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog by slug
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const db = await initDb();
    const blog = await db.get('SELECT * FROM blogs WHERE slug = ?', slug);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog by ID
app.get('/api/blogs/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDb();
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create blog
app.post('/api/blogs', authenticateToken, async (req, res) => {
  try {
    const {
      slug, title, description, content, cover_image, category,
      read_time, published_date, redirect_url, seo_title, seo_description, is_featured
    } = req.body;

    const db = await initDb();

    // Check if slug exists
    const existing = await db.get('SELECT id FROM blogs WHERE slug = ?', slug);
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const result = await db.run(
      `INSERT INTO blogs (
        slug, title, description, content, cover_image, category, 
        read_time, published_date, redirect_url, seo_title, seo_description, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      slug, title, description, content, cover_image, category,
      read_time, published_date, redirect_url, seo_title, seo_description, is_featured ? 1 : 0
    );

    res.json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog
app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug, title, description, content, cover_image, category,
      read_time, published_date, redirect_url, seo_title, seo_description, is_featured
    } = req.body;

    const db = await initDb();

    // Check if slug exists for other blogs
    const existing = await db.get('SELECT id FROM blogs WHERE slug = ? AND id != ?', slug, id);
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    await db.run(
      `UPDATE blogs SET 
        slug = ?, title = ?, description = ?, content = ?, cover_image = ?, category = ?, 
        read_time = ?, published_date = ?, redirect_url = ?, seo_title = ?, seo_description = ?, is_featured = ?
      WHERE id = ?`,
      slug, title, description, content, cover_image, category,
      read_time, published_date, redirect_url, seo_title, seo_description, is_featured ? 1 : 0, id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog
app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDb();
    await db.run('DELETE FROM blogs WHERE id = ?', id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Portfolio Routes

// Get all portfolio projects
app.get('/api/portfolio', async (req, res) => {
  try {
    const db = await initDb();
    const { status } = req.query;
    let query = 'SELECT * FROM portfolio_projects';
    const params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const projects = await db.all(query, ...params);
    res.json(projects);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project by slug
app.get('/api/portfolio/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const db = await initDb();
    const project = await db.get('SELECT * FROM portfolio_projects WHERE slug = ?', slug);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project by ID
app.get('/api/portfolio/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDb();
    const project = await db.get('SELECT * FROM portfolio_projects WHERE id = ?', id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project
app.post('/api/portfolio', authenticateToken, async (req, res) => {
  try {
    const {
      slug, title, short_description, full_description, thumbnail_image, category, before_image, after_image,
      gallery_images, technologies, live_url, github_url, completion_date, status
    } = req.body;

    const db = await initDb();

    const existing = await db.get('SELECT id FROM portfolio_projects WHERE slug = ?', slug);
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const result = await db.run(
      `INSERT INTO portfolio_projects (
        slug, title, short_description, full_description, thumbnail_image, category, before_image, after_image, 
        gallery_images, technologies, live_url, github_url, completion_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      slug, title, short_description, full_description, thumbnail_image, category, before_image, after_image,
      JSON.stringify(gallery_images || []), JSON.stringify(technologies || []), live_url, github_url, completion_date, status || 'draft'
    );

    res.json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
app.put('/api/portfolio/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug, title, short_description, full_description, thumbnail_image, category, before_image, after_image,
      gallery_images, technologies, live_url, github_url, completion_date, status
    } = req.body;

    const db = await initDb();

    const existing = await db.get('SELECT id FROM portfolio_projects WHERE slug = ? AND id != ?', slug, id);
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    await db.run(
      `UPDATE portfolio_projects SET 
        slug = ?, title = ?, short_description = ?, full_description = ?, thumbnail_image = ?, category = ?, before_image = ?, after_image = ?,
        gallery_images = ?, technologies = ?, live_url = ?, github_url = ?, completion_date = ?, status = ?
      WHERE id = ?`,
      slug, title, short_description, full_description, thumbnail_image, category, before_image, after_image,
      JSON.stringify(gallery_images || []), JSON.stringify(technologies || []), live_url, github_url, completion_date, status, id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
app.delete('/api/portfolio/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await initDb();
    await db.run('DELETE FROM portfolio_projects WHERE id = ?', id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
