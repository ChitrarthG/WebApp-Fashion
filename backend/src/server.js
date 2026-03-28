const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./loadEnv');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\+?[0-9()\-\s]{7,20}$/.test(phone);
}

function parsePositiveId(id) {
  const parsed = Number.parseInt(id, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiError(400, 'Invalid ID parameter');
  }
  return parsed;
}

function safeEqualText(a, b) {
  const left = Buffer.from(a || '', 'utf8');
  const right = Buffer.from(b || '', 'utf8');
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

// Middleware
app.set('trust proxy', 1);

app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

app.use(helmet());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new ApiError(403, 'CORS policy blocked this origin'));
  },
}));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.API_RATE_LIMIT_MAX || '200', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to React App Backend API' });
});

// Health check endpoint
app.get('/api/health', asyncHandler(async (req, res) => {
  await db.query('SELECT 1');
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
}));

// Get all users endpoint
app.get('/api/users', asyncHandler(async (req, res) => {
  const result = await db.query('SELECT * FROM users ORDER BY id ASC');
  res.json(result.rows);
}));

// Create a new user endpoint
app.post('/api/users', asyncHandler(async (req, res) => {
  const name = normalizeText(req.body.name, 100);
  const email = normalizeText(req.body.email, 100).toLowerCase();

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }
  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }

  const result = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );

  res.status(201).json(result.rows[0]);
}));

// Get user by ID
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  res.json(result.rows[0]);
}));

// Update user
app.put('/api/users/:id', asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const name = normalizeText(req.body.name, 100);
  const email = normalizeText(req.body.email, 100).toLowerCase();

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }
  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }

  const result = await db.query(
    'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
    [name, email, id]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  res.json(result.rows[0]);
}));

// Delete user
app.delete('/api/users/:id', asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  res.json({ message: 'User deleted successfully', user: result.rows[0] });
}));

// ── Appointment helpers ──────────────────────────────────
function generateReferenceId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'APT-';
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

const CHATBOT_SERVICES = [
  'Dental Care',
  'General Medicine',
  'Pediatrics',
  'Diagnostics',
];
const CHATBOT_SESSION_TTL_MS = 30 * 60 * 1000;
const chatSessions = new Map();

function parseAppointmentDatetime(rawValue) {
  if (!rawValue) {
    return null;
  }

  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, 'Please provide a valid appointment date and time');
  }
  return parsed.toISOString();
}

async function createAppointmentRecord(payload) {
  const name = normalizeText(payload.name, 100);
  const emailRaw = normalizeText(payload.email, 100).toLowerCase();
  const phone = normalizeText(payload.phone, 20);
  const service = normalizeText(payload.service, 100);
  const message = normalizeText(payload.message, 2000);
  const appointmentDatetime = parseAppointmentDatetime(payload.appointmentDatetime || null);

  if (!name || !phone || !service) {
    throw new ApiError(400, 'Name, phone and service are required');
  }
  if (!isValidPhone(phone)) {
    throw new ApiError(400, 'Please provide a valid phone number');
  }
  if (emailRaw && !isValidEmail(emailRaw)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }

  // Generate unique reference (retry on collision)
  let referenceId;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateReferenceId();
    const existing = await db.query(
      'SELECT id FROM appointments WHERE reference_id = $1',
      [candidate]
    );
    if (existing.rows.length === 0) {
      referenceId = candidate;
      break;
    }
  }
  if (!referenceId) {
    throw new ApiError(500, 'Could not generate reference. Please try again.');
  }

  const result = await db.query(
    `INSERT INTO appointments
       (reference_id, name, email, phone, service, appointment_datetime, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [referenceId, name, emailRaw || null, phone, service, appointmentDatetime, message || null]
  );

  return result.rows[0];
}

function createChatSession() {
  return {
    step: 'service',
    data: {
      service: '',
      appointmentDatetime: null,
      name: '',
      phone: '',
      email: '',
      message: '',
    },
    updatedAt: Date.now(),
  };
}

function pruneChatSessions() {
  const now = Date.now();
  for (const [sessionId, session] of chatSessions.entries()) {
    if (now - session.updatedAt > CHATBOT_SESSION_TTL_MS) {
      chatSessions.delete(sessionId);
    }
  }
}

function getServiceFromInput(rawMessage) {
  const text = normalizeText(rawMessage, 100).toLowerCase();
  if (!text) {
    return '';
  }

  const numberMatch = text.match(/\b([1-4])\b/);
  if (numberMatch) {
    return CHATBOT_SERVICES[Number.parseInt(numberMatch[1], 10) - 1];
  }

  const exact = CHATBOT_SERVICES.find((service) => service.toLowerCase() === text);
  if (exact) {
    return exact;
  }

  const partial = CHATBOT_SERVICES.find((service) => text.includes(service.toLowerCase()));
  return partial || '';
}

function buildServicePrompt() {
  const list = CHATBOT_SERVICES.map((service, index) => `${index + 1}. ${service}`).join('\n');
  return `Hi, I can help you book an appointment. Please choose a service by typing its name or number:\n${list}`;
}

function isSkipInput(rawMessage) {
  const text = normalizeText(rawMessage, 50).toLowerCase();
  return ['skip', 'no', 'none', 'na', 'n/a'].includes(text);
}

function isYesInput(rawMessage) {
  const text = normalizeText(rawMessage, 20).toLowerCase();
  return ['yes', 'y', 'confirm', 'book', 'ok', 'okay'].includes(text);
}

function isNoInput(rawMessage) {
  const text = normalizeText(rawMessage, 20).toLowerCase();
  return ['no', 'n', 'cancel'].includes(text);
}

function isRestartInput(rawMessage) {
  const text = normalizeText(rawMessage, 50).toLowerCase();
  return ['restart', 'reset', 'start over', 'new booking'].includes(text);
}

function buildBookingSummary(chatData) {
  const dateText = chatData.appointmentDatetime
    ? new Date(chatData.appointmentDatetime).toLocaleString('en-IN')
    : 'Not specified';
  const emailText = chatData.email || 'Not specified';
  const noteText = chatData.message || 'None';

  return [
    'Please confirm your appointment details:',
    `Service: ${chatData.service}`,
    `Date and Time: ${dateText}`,
    `Name: ${chatData.name}`,
    `Phone: ${chatData.phone}`,
    `Email: ${emailText}`,
    `Note: ${noteText}`,
    'Reply Yes to confirm booking, or No to restart.',
  ].join('\n');
}

function requireAdminAuth(req, res, next) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin credentials are not configured on the server.' });
  }

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Portal"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const encoded = authHeader.slice(6);
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : decoded;
  const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

  if (!safeEqualText(username, ADMIN_USERNAME) || !safeEqualText(password, ADMIN_PASSWORD)) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Portal"');
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  next();
}

// Create appointment
app.post('/api/appointments', asyncHandler(async (req, res) => {
  const record = await createAppointmentRecord(req.body || {});
  res.status(201).json({ success: true, referenceId: record.reference_id });
}));

// Chatbot booking endpoint
app.post('/api/chatbot/message', asyncHandler(async (req, res) => {
  pruneChatSessions();

  const incomingMessage = normalizeText(req.body.message, 500);
  if (!incomingMessage) {
    throw new ApiError(400, 'Message is required');
  }

  const providedSessionId = normalizeText(req.body.sessionId, 100);
  const sessionId = providedSessionId || crypto.randomUUID();
  const existing = chatSessions.get(sessionId);
  const session = existing || createChatSession();

  if (isRestartInput(incomingMessage)) {
    const restarted = createChatSession();
    chatSessions.set(sessionId, restarted);
    return res.json({
      sessionId,
      step: restarted.step,
      completed: false,
      reply: buildServicePrompt(),
    });
  }

  if (incomingMessage === '__start__') {
    session.updatedAt = Date.now();
    chatSessions.set(sessionId, session);
    return res.json({
      sessionId,
      step: session.step,
      completed: false,
      reply: buildServicePrompt(),
    });
  }

  let reply = '';
  let completed = false;
  let referenceId = null;

  if (session.step === 'service') {
    const matchedService = getServiceFromInput(incomingMessage);
    if (!matchedService) {
      reply = `I could not match that service. ${buildServicePrompt()}`;
    } else {
      session.data.service = matchedService;
      session.step = 'datetime';
      reply = 'Please share your preferred appointment date and time (for example: 2026-04-18 10:30 AM). Type Skip if you are flexible.';
    }
  } else if (session.step === 'datetime') {
    if (isSkipInput(incomingMessage)) {
      session.data.appointmentDatetime = null;
    } else {
      try {
        session.data.appointmentDatetime = parseAppointmentDatetime(incomingMessage);
      } catch (error) {
        if (error instanceof ApiError) {
          reply = 'Please share a valid date and time (for example: 2026-04-18 10:30 AM), or type Skip.';
        } else {
          throw error;
        }
      }
    }

    if (!reply) {
      session.step = 'name';
      reply = 'Please provide your full name.';
    }
  } else if (session.step === 'name') {
    const name = normalizeText(incomingMessage, 100);
    if (name.length < 2) {
      reply = 'Please share a valid name with at least 2 characters.';
    } else {
      session.data.name = name;
      session.step = 'phone';
      reply = 'Please provide your phone number.';
    }
  } else if (session.step === 'phone') {
    const phone = normalizeText(incomingMessage, 20);
    if (!isValidPhone(phone)) {
      reply = 'Please share a valid phone number (digits and optional +, spaces, -, or parentheses).';
    } else {
      session.data.phone = phone;
      session.step = 'email';
      reply = 'Please share your email address, or type Skip.';
    }
  } else if (session.step === 'email') {
    if (isSkipInput(incomingMessage)) {
      session.data.email = '';
    } else {
      const email = normalizeText(incomingMessage, 100).toLowerCase();
      if (!isValidEmail(email)) {
        reply = 'Please share a valid email address or type Skip.';
      } else {
        session.data.email = email;
      }
    }

    if (!reply) {
      session.step = 'message';
      reply = 'Any notes for the doctor? Type your message or Skip.';
    }
  } else if (session.step === 'message') {
    session.data.message = isSkipInput(incomingMessage)
      ? ''
      : normalizeText(incomingMessage, 2000);
    session.step = 'confirm';
    reply = buildBookingSummary(session.data);
  } else if (session.step === 'confirm') {
    if (isYesInput(incomingMessage)) {
      const record = await createAppointmentRecord(session.data);
      session.step = 'done';
      completed = true;
      referenceId = record.reference_id;
      reply = `Your appointment is booked successfully. Your booking reference is ${record.reference_id}. Reply "new booking" if you want to create another appointment.`;
    } else if (isNoInput(incomingMessage)) {
      const restarted = createChatSession();
      chatSessions.set(sessionId, restarted);
      return res.json({
        sessionId,
        step: restarted.step,
        completed: false,
        reply: `No problem, let us start again. ${buildServicePrompt()}`,
      });
    } else {
      reply = 'Please reply with Yes to confirm booking or No to restart.';
    }
  } else {
    reply = 'Your booking is completed. Type "new booking" to create another appointment.';
    completed = true;
  }

  session.updatedAt = Date.now();
  chatSessions.set(sessionId, session);

  res.json({
    sessionId,
    step: session.step,
    completed,
    referenceId,
    reply,
  });
}));

// List all appointments (admin)
app.get('/api/appointments', requireAdminAuth, asyncHandler(async (req, res) => {
  const result = await db.query('SELECT * FROM appointments ORDER BY created_at DESC');
  res.json(result.rows);
}));

// Update appointment status (admin)
app.patch('/api/appointments/:id/status', requireAdminAuth, asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const status = normalizeText(req.body.status, 20).toLowerCase();
  const valid = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];
  if (!valid.includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }
  const result = await db.query(
    'UPDATE appointments SET status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
    [status, id]
  );
  if (result.rows.length === 0) {
    throw new ApiError(404, 'Appointment not found');
  }
  res.json(result.rows[0]);
}));

// Location endpoint - Google Maps
app.get('/api/location', (req, res) => {
  const locationData = {
    name: 'The Bike Affair Shop',
    address: 'Kondapur, Hyderabad, Telangana, India',
    latitude: 17.4566,
    longitude: 78.3669,
    description: 'Premium bike and accessories shop'
  };
  res.json(locationData);
});

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestId: req.requestId,
  });
});

// Error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error('Unhandled server error', {
      requestId: req.requestId,
      message: error.message,
      stack: error.stack,
    });
  }

  const payload = {
    error: statusCode >= 500 ? 'Internal server error' : error.message,
    requestId: req.requestId,
  };

  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) {
    payload.details = error.message;
  }

  res.status(statusCode).json(payload);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
