const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('./loadEnv');
const db = require('./db');

// Fashion E-commerce API for Vayu Fashion

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const frontendBuildPath = path.resolve(__dirname, '..', '..', 'frontend', 'build');
const frontendIndexPath = path.join(frontendBuildPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath);
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
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
    } catch (err) {
      next(err);
    }
  };
}

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function sanitizeReviewCopy(value, replacement) {
  if (typeof value !== 'string') return '';
  return value.replace(/pantaloons?/gi, replacement);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\+?[0-9()\-\s]{7,20}$/.test(phone);
}

function parsePositiveId(id) {
  const parsed = Number.parseInt(id, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new ApiError(400, 'Invalid ID');
  return parsed;
}

function safeEqualText(a, b) {
  const left = Buffer.from(a || '', 'utf8');
  const right = Buffer.from(b || '', 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function requireAdminAuth(req, res, next) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin credentials not configured.' });
  }
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).json({ error: 'Authentication required' });
  }
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const sep = decoded.indexOf(':');
  const username = sep >= 0 ? decoded.slice(0, sep) : decoded;
  const password = sep >= 0 ? decoded.slice(sep + 1) : '';
  if (!safeEqualText(username, ADMIN_USERNAME) || !safeEqualText(password, ADMIN_PASSWORD)) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  next();
}

function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'ORD-';
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// Shopping chatbot
const CHAT_TTL = 30 * 60 * 1000;
const chatSessions = new Map();

function pruneSessions() {
  const now = Date.now();
  for (const [id, s] of chatSessions.entries()) {
    if (now - s.updatedAt > CHAT_TTL) chatSessions.delete(id);
  }
}

async function botReply(sessionId, message) {
  pruneSessions();
  const session = chatSessions.get(sessionId) || { step: 'greet', updatedAt: Date.now() };
  const msg = normalizeText(message, 500).toLowerCase();
  let reply = '';

  if (msg === '__start__' || session.step === 'greet') {
    reply = "Hi! Welcome to Vayu Fashion. How can I help you today?\n1. Browse Women's Fashion\n2. Browse Men's Fashion\n3. Kids Collection\n4. Track my order\n5. Help with sizing";
    session.step = 'menu';
  } else if (msg.includes('1') || msg.includes('women')) {
    reply = "Check out our Women's collection: Dresses, Kurtis, Tops, Jeans, Ethnic Wear and more!";
    session.step = 'menu';
  } else if (msg.includes('2') || msg.includes('men')) {
    reply = "Men's picks: Shirts, T-Shirts, Jeans, Trousers, Ethnic & Activewear!";
    session.step = 'menu';
  } else if (msg.includes('3') || msg.includes('kids')) {
    reply = "Adorable kids wear: Boys, Girls, and Toddler collections!";
    session.step = 'menu';
  } else if (msg.includes('4') || msg.includes('track') || msg.includes('order')) {
    reply = "Please share your order number (format: ORD-XXXXXXXX) to track it.";
    session.step = 'track';
  } else if (msg.includes('5') || msg.includes('size')) {
    reply = "Size Guide:\nWomen: XS(32), S(34), M(36), L(38), XL(40), XXL(42)\nMen: S(38), M(40), L(42), XL(44), XXL(46)";
    session.step = 'menu';
  } else if (session.step === 'track') {
    const orderMatch = msg.match(/ord[-\s]?[a-z0-9]{6,10}/i);
    if (orderMatch) {
      try {
        const num = orderMatch[0].toUpperCase().replace(/\s/g, '');
        const result = await db.query(
          'SELECT order_number, status, created_at FROM orders WHERE order_number = $1',
          [num]
        );
        if (result.rows.length > 0) {
          const o = result.rows[0];
          reply = 'Order ' + o.order_number + ' - Status: ' + o.status.toUpperCase() + ' (placed ' + new Date(o.created_at).toLocaleDateString('en-IN') + ')';
        } else {
          reply = "Order not found. Please check the order number and try again.";
        }
      } catch (_) {
        reply = "Could not look up order right now. Please try again later.";
      }
      session.step = 'menu';
    } else {
      reply = "Please share a valid order number like ORD-AB12CD34.";
    }
  } else {
    reply = "Type 'menu' to see options, or ask about our fashion collections!";
    session.step = 'menu';
  }

  session.updatedAt = Date.now();
  chatSessions.set(sessionId, session);
  return { reply, step: session.step };
}

//  Middleware 
app.set('trust proxy', 1);

app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

app.use(helmet());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new ApiError(403, 'CORS policy blocked this origin'));
    }
  },
}));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.API_RATE_LIMIT_MAX || '300', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

if (process.env.NODE_ENV === 'production' && hasFrontendBuild) {
  app.use(express.static(frontendBuildPath));
}

// ─────────────────────────────────────────────
// Password & Auth Utilities
// ─────────────────────────────────────────────
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// In-memory session store (in production, use Redis or database)
const sessionStore = new Map();

function createSession(userId) {
  const token = generateSessionToken();
  sessionStore.set(token, {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
  });
  return token;
}

function validateSession(token) {
  const session = sessionStore.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessionStore.delete(token);
    return null;
  }
  return session;
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  const token = authHeader.slice(7);
  const session = validateSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.userId = session.userId;
  req.sessionToken = token;
  next();
}

//  Routes 

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production' && hasFrontendBuild) {
    res.sendFile(frontendIndexPath);
    return;
  }
  res.json({ message: 'Vayu Fashion API' });
});

app.get('/api/health', asyncHandler(async (req, res) => {
  await db.query('SELECT 1');
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development', timestamp: new Date().toISOString() });
}));

// ─────────────────────────────────────────────
// Authentication Routes
// ─────────────────────────────────────────────

// POST /api/auth/register - Register new user
app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }
  
  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Invalid email format');
  }
  
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }
  
  // Check if user already exists
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw new ApiError(409, 'Email already registered');
  }
  
  const passwordHash = hashPassword(password);
  const result = await db.query(
    'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
    [normalizeText(name, 100), email.toLowerCase(), normalizeText(phone, 20), passwordHash]
  );
  
  const user = result.rows[0];
  const token = createSession(user.id);
  
  res.status(201).json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
}));

// POST /api/auth/login - Login user
app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  
  const result = await db.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1 AND is_active = true',
    [email.toLowerCase()]
  );
  
  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  const user = result.rows[0];
  const passwordHash = hashPassword(password);
  
  if (!safeEqualText(user.password_hash, passwordHash)) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  // Update last login
  await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
  
  const token = createSession(user.id);
  
  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
}));

// GET /api/auth/me - Get current user
app.get('/api/auth/me', requireAuth, asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT id, name, email, phone, gender, date_of_birth, address, city, state, postal_code FROM users WHERE id = $1',
    [req.userId]
  );
  
  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }
  
  res.json(result.rows[0]);
}));

// PUT /api/auth/profile - Update user profile
app.put('/api/auth/profile', requireAuth, asyncHandler(async (req, res) => {
  const { name, phone, gender, date_of_birth, address, city, state, postal_code } = req.body;
  
  const result = await db.query(
    `UPDATE users 
     SET name = COALESCE($2, name),
         phone = COALESCE($3, phone),
         gender = COALESCE($4, gender),
         date_of_birth = COALESCE($5, date_of_birth),
         address = COALESCE($6, address),
         city = COALESCE($7, city),
         state = COALESCE($8, state),
         postal_code = COALESCE($9, postal_code),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, name, email, phone, gender, date_of_birth, address, city, state, postal_code`,
    [req.userId, name, phone, gender, date_of_birth, address, city, state, postal_code]
  );
  
  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }
  
  res.json({ success: true, user: result.rows[0] });
}));

// POST /api/auth/logout - Logout user
app.post('/api/auth/logout', requireAuth, asyncHandler(async (req, res) => {
  sessionStore.delete(req.sessionToken);
  res.json({ success: true, message: 'Logged out successfully' });
}));

// POST /api/auth/change-password - Change password
app.post('/api/auth/change-password', requireAuth, asyncHandler(async (req, res) => {
  const { old_password, new_password } = req.body;
  
  if (!old_password || !new_password) {
    throw new ApiError(400, 'Old and new passwords are required');
  }
  
  if (new_password.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }
  
  const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.userId]);
  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }
  
  const oldHash = hashPassword(old_password);
  if (!safeEqualText(result.rows[0].password_hash, oldHash)) {
    throw new ApiError(401, 'Current password is incorrect');
  }
  
  const newHash = hashPassword(new_password);
  await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, req.userId]);
  
  res.json({ success: true, message: 'Password changed successfully' });
}));

//  Categories 

app.get('/api/categories', asyncHandler(async (req, res) => {
  const result = await db.query('SELECT * FROM categories ORDER BY display_order ASC');
  res.json(result.rows);
}));

//  Products 

app.get('/api/products', asyncHandler(async (req, res) => {
  const {
    category,
    search,
    featured,
    newArrivals,
    sale,
    minPrice,
    maxPrice,
    size,
    color,
    minRating,
    minDiscount,
    sort = 'newest',
    limit: lim,
    offset: off,
    count: withCount,
  } = req.query;
  const conditions = [];
  const params = [];
  let idx = 1;

  if (category) {
    conditions.push('c.slug = $' + idx++);
    params.push(normalizeText(category, 100));
  }
  if (search) {
    conditions.push('(p.name ILIKE $' + idx + ' OR p.brand ILIKE $' + idx + ')');
    params.push('%' + normalizeText(search, 100) + '%');
    idx++;
  }
  if (featured === 'true') { conditions.push('p.is_featured = TRUE'); }
  if (newArrivals === 'true') { conditions.push('p.is_new = TRUE'); }
  if (sale === 'true') { conditions.push('p.is_on_sale = TRUE'); }
  if (minPrice && !Number.isNaN(Number(minPrice))) {
    conditions.push('p.price >= $' + idx++);
    params.push(Number(minPrice));
  }
  if (maxPrice && !Number.isNaN(Number(maxPrice))) {
    conditions.push('p.price <= $' + idx++);
    params.push(Number(maxPrice));
  }
  if (size) {
    conditions.push('$' + idx++ + ' = ANY(p.sizes)');
    params.push(normalizeText(size, 20));
  }
  if (color) {
    conditions.push('$' + idx++ + ' = ANY(p.colors)');
    params.push(normalizeText(color, 50));
  }
  if (minRating && !Number.isNaN(Number(minRating))) {
    conditions.push('p.rating >= $' + idx++);
    params.push(Number(minRating));
  }
  if (minDiscount && !Number.isNaN(Number(minDiscount))) {
    conditions.push('p.discount_pct >= $' + idx++);
    params.push(Number(minDiscount));
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const limitVal = Math.min(Number.parseInt(lim || '20', 10), 100);
  const offsetVal = Math.max(Number.parseInt(off || '0', 10), 0);
  const orderByMap = {
    newest: 'p.created_at DESC',
    price_asc: 'p.price ASC',
    price_desc: 'p.price DESC',
    rating_desc: 'p.rating DESC',
    discount_desc: 'p.discount_pct DESC',
  };
  const orderBy = orderByMap[sort] || orderByMap.newest;

  const countParams = [...params];
  const sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id ' + where + ' ORDER BY ' + orderBy + ' LIMIT $' + idx + ' OFFSET $' + (idx + 1);
  params.push(limitVal, offsetVal);

  if (withCount === 'true') {
    const countSql = 'SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ' + where;
    const [result, countResult] = await Promise.all([
      db.query(sql, params),
      db.query(countSql, countParams),
    ]);
    res.json({ rows: result.rows, total: parseInt(countResult.rows[0].count, 10) });
  } else {
    const result = await db.query(sql, params);
    res.json(result.rows);
  }
}));

app.get('/api/search/suggestions', asyncHandler(async (req, res) => {
  const q = normalizeText(req.query.q || '', 80);
  if (q.length < 2) return res.json({ products: [], brands: [], categories: [] });

  const [productsResult, brandsResult, categoriesResult] = await Promise.all([
    db.query(
      'SELECT id, name, brand, price FROM products WHERE name ILIKE $1 OR brand ILIKE $1 ORDER BY rating DESC, review_count DESC LIMIT 8',
      ['%' + q + '%']
    ),
    db.query(
      'SELECT DISTINCT brand FROM products WHERE brand ILIKE $1 ORDER BY brand ASC LIMIT 6',
      ['%' + q + '%']
    ),
    db.query(
      'SELECT id, name, slug FROM categories WHERE name ILIKE $1 ORDER BY display_order ASC LIMIT 6',
      ['%' + q + '%']
    ),
  ]);

  res.json({
    products: productsResult.rows,
    brands: brandsResult.rows.map((r) => r.brand).filter(Boolean),
    categories: categoriesResult.rows,
  });
}));

app.get('/api/reviews/highlights', asyncHandler(async (req, res) => {
  const result = await db.query(
    `SELECT p.id, p.name, p.brand, p.rating, p.review_count,
      CASE
        WHEN p.rating >= 4.7 THEN 'Loved the fit and quality, exactly as shown.'
        WHEN p.rating >= 4.4 THEN 'Great fabric and very comfortable for all-day wear.'
        WHEN p.rating >= 4.0 THEN 'Good value for money and fast delivery experience.'
        ELSE 'Nice design and decent quality for the price.'
      END AS review_text
      FROM products p
      WHERE p.review_count > 0
      ORDER BY p.rating DESC, p.review_count DESC
      LIMIT 8`
  );

  const reviewLabels = [
    'Studio Pick',
    'Urban Edit',
    'Style Note',
    'Trend Select',
    'Daily Muse',
    'Signature Find',
    'Fresh Wardrobe',
    'Modern Thread'
  ];

  const reviews = result.rows.map((row) => {
    const seed = String(row.id || row.name || 'review');
    const hash = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
    const displayLabel = reviewLabels[hash % reviewLabels.length];

    return {
      ...row,
      name: sanitizeReviewCopy(row.name, displayLabel),
      brand: displayLabel,
      review_text: sanitizeReviewCopy(row.review_text, displayLabel)
    };
  });

  res.json(reviews);
}));

app.get('/api/products/featured', asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = TRUE ORDER BY p.rating DESC LIMIT 8'
  );
  res.json(result.rows);
}));

app.get('/api/products/new-arrivals', asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_new = TRUE ORDER BY p.created_at DESC LIMIT 8'
  );
  res.json(result.rows);
}));

app.get('/api/products/sale', asyncHandler(async (req, res) => {
  const result = await db.query(
    'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_on_sale = TRUE ORDER BY p.discount_pct DESC LIMIT 8'
  );
  res.json(result.rows);
}));

app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const result = await db.query(
    'SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
    [id]
  );
  if (result.rows.length === 0) throw new ApiError(404, 'Product not found');
  res.json(result.rows[0]);
}));

//  Cart (session-based, no login required) 

app.get('/api/cart/:sessionId', asyncHandler(async (req, res) => {
  const sessionId = normalizeText(req.params.sessionId, 100);
  if (!sessionId) throw new ApiError(400, 'Session ID required');
  const result = await db.query(
    'SELECT ci.*, p.name, p.price, p.image_url, p.brand FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.session_id = $1',
    [sessionId]
  );
  res.json(result.rows);
}));

app.post('/api/cart', asyncHandler(async (req, res) => {
  const sessionId = normalizeText(req.body.sessionId, 100);
  const productId = parsePositiveId(req.body.productId + '');
  const size = normalizeText(req.body.size || '', 20);
  const color = normalizeText(req.body.color || '', 50);
  const qty = Math.max(1, Number.parseInt(req.body.quantity || '1', 10));

  if (!sessionId) throw new ApiError(400, 'Session ID required');

  const prod = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (prod.rows.length === 0) throw new ApiError(404, 'Product not found');

  const existing = await db.query(
    'SELECT id, quantity FROM cart_items WHERE session_id=$1 AND product_id=$2 AND size=$3',
    [sessionId, productId, size]
  );

  let result;
  if (existing.rows.length > 0) {
    result = await db.query(
      'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
      [qty, existing.rows[0].id]
    );
  } else {
    result = await db.query(
      'INSERT INTO cart_items (session_id, product_id, size, color, quantity) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [sessionId, productId, size, color, qty]
    );
  }
  res.status(201).json(result.rows[0]);
}));

app.put('/api/cart/:id', asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const qty = Math.max(1, Number.parseInt(req.body.quantity || '1', 10));
  const result = await db.query('UPDATE cart_items SET quantity=$1 WHERE id=$2 RETURNING *', [qty, id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Cart item not found');
  res.json(result.rows[0]);
}));

app.delete('/api/cart/:id', asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const result = await db.query('DELETE FROM cart_items WHERE id=$1 RETURNING *', [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Cart item not found');
  res.json({ message: 'Item removed from cart' });
}));

//  Orders 

app.post('/api/orders', asyncHandler(async (req, res) => {
  const customerName = normalizeText(req.body.customerName, 100);
  const customerEmail = normalizeText(req.body.customerEmail, 100).toLowerCase();
  const customerPhone = normalizeText(req.body.customerPhone || '', 20);
  const shippingAddress = normalizeText(req.body.shippingAddress, 500);
  const paymentMethod = normalizeText(req.body.paymentMethod || 'cod', 50);
  const items = req.body.items;

  if (!customerName || !customerEmail || !shippingAddress) {
    throw new ApiError(400, 'Name, email and shipping address are required');
  }
  if (!isValidEmail(customerEmail)) throw new ApiError(400, 'Invalid email address');
  if (customerPhone && !isValidPhone(customerPhone)) throw new ApiError(400, 'Invalid phone number');
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, 'Order must have at least one item');

  let orderNumber;
  for (let i = 0; i < 5; i++) {
    const candidate = generateOrderNumber();
    const ex = await db.query('SELECT id FROM orders WHERE order_number=$1', [candidate]);
    if (ex.rows.length === 0) { orderNumber = candidate; break; }
  }
  if (!orderNumber) throw new ApiError(500, 'Could not generate order number');

  let totalAmount = 0;
  const orderItems = [];
  for (const item of items) {
    const productId = Number.parseInt(item.productId, 10);
    const quantity = Math.max(1, Number.parseInt(item.quantity || '1', 10));
    const prod = await db.query('SELECT id, name, price FROM products WHERE id=$1', [productId]);
    if (prod.rows.length === 0) throw new ApiError(400, 'Product ' + productId + ' not found');
    const unitPrice = parseFloat(prod.rows[0].price);
    totalAmount += unitPrice * quantity;
    orderItems.push({ productId, name: prod.rows[0].name, size: normalizeText(item.size || '', 20), color: normalizeText(item.color || '', 50), quantity, unitPrice });
  }

  const orderResult = await db.query(
    'INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [orderNumber, customerName, customerEmail, customerPhone || null, shippingAddress, totalAmount.toFixed(2), paymentMethod]
  );
  const order = orderResult.rows[0];

  for (const item of orderItems) {
    await db.query(
      'INSERT INTO order_items (order_id, product_id, name, size, color, quantity, unit_price) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [order.id, item.productId, item.name, item.size, item.color, item.quantity, item.unitPrice]
    );
  }

  res.status(201).json({ success: true, orderNumber: order.order_number, totalAmount: order.total_amount });
}));

app.get('/api/orders/:orderNumber', asyncHandler(async (req, res) => {
  const orderNumber = normalizeText(req.params.orderNumber, 30).toUpperCase();
  const orderResult = await db.query('SELECT * FROM orders WHERE order_number=$1', [orderNumber]);
  if (orderResult.rows.length === 0) throw new ApiError(404, 'Order not found');
  const order = orderResult.rows[0];
  const itemsResult = await db.query('SELECT * FROM order_items WHERE order_id=$1', [order.id]);
  res.json({ ...order, items: itemsResult.rows });
}));

//  Chatbot 

app.post('/api/chatbot/message', asyncHandler(async (req, res) => {
  const message = normalizeText(req.body.message, 500);
  if (!message) throw new ApiError(400, 'Message is required');
  const sessionId = normalizeText(req.body.sessionId || '', 100) || crypto.randomUUID();
  const { reply, step } = await botReply(sessionId, message);
  res.json({ sessionId, reply, step });
}));

//  Newsletter subscribe 

app.post('/api/newsletter', asyncHandler(async (req, res) => {
  const email = normalizeText(req.body.email, 100).toLowerCase();
  if (!email || !isValidEmail(email)) throw new ApiError(400, 'Valid email required');
  res.json({ success: true, message: 'Thank you for subscribing to Vayu Fashion!' });
}));

//  Admin: Products 

app.get('/api/admin/products', requireAdminAuth, asyncHandler(async (req, res) => {
  const result = await db.query('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id=c.id ORDER BY p.created_at DESC');
  res.json(result.rows);
}));

app.post('/api/admin/products', requireAdminAuth, asyncHandler(async (req, res) => {
  const { name, description, category_id, price, mrp, discount_pct, brand, sizes, colors, stock, is_new, is_featured, is_on_sale, image_url, image_url_2 } = req.body;
  const productName = normalizeText(name, 200);
  if (!productName) throw new ApiError(400, 'Product name required');
  const priceVal = parseFloat(price);
  if (isNaN(priceVal) || priceVal <= 0) throw new ApiError(400, 'Valid price required');

  const result = await db.query(
    'INSERT INTO products (name, description, category_id, price, mrp, discount_pct, brand, sizes, colors, stock, is_new, is_featured, is_on_sale, image_url, image_url_2) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
    [productName, normalizeText(description || '', 2000), category_id || null, priceVal, parseFloat(mrp) || null, parseInt(discount_pct) || 0, normalizeText(brand || '', 100), sizes || [], colors || [], parseInt(stock) || 0, !!is_new, !!is_featured, !!is_on_sale, normalizeText(image_url || '', 500), normalizeText(image_url_2 || '', 500)]
  );
  res.status(201).json(result.rows[0]);
}));

app.put('/api/admin/products/:id', requireAdminAuth, asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const { name, description, category_id, price, mrp, discount_pct, brand, sizes, colors, stock, is_new, is_featured, is_on_sale, image_url, image_url_2 } = req.body;
  const productName = normalizeText(name, 200);
  if (!productName) throw new ApiError(400, 'Product name required');
  const priceVal = parseFloat(price);
  if (isNaN(priceVal) || priceVal <= 0) throw new ApiError(400, 'Valid price required');

  const result = await db.query(
    'UPDATE products SET name=$1, description=$2, category_id=$3, price=$4, mrp=$5, discount_pct=$6, brand=$7, sizes=$8, colors=$9, stock=$10, is_new=$11, is_featured=$12, is_on_sale=$13, image_url=$14, image_url_2=$15, updated_at=CURRENT_TIMESTAMP WHERE id=$16 RETURNING *',
    [productName, normalizeText(description || '', 2000), category_id || null, priceVal, parseFloat(mrp) || null, parseInt(discount_pct) || 0, normalizeText(brand || '', 100), sizes || [], colors || [], parseInt(stock) || 0, !!is_new, !!is_featured, !!is_on_sale, normalizeText(image_url || '', 500), normalizeText(image_url_2 || '', 500), id]
  );
  if (result.rows.length === 0) throw new ApiError(404, 'Product not found');
  res.json(result.rows[0]);
}));

app.delete('/api/admin/products/:id', requireAdminAuth, asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const result = await db.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Product not found');
  res.json({ message: 'Product deleted successfully' });
}));

//  Admin: Orders 

app.get('/api/admin/orders', requireAdminAuth, asyncHandler(async (req, res) => {
  const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(result.rows);
}));

app.patch('/api/admin/orders/:id/status', requireAdminAuth, asyncHandler(async (req, res) => {
  const id = parsePositiveId(req.params.id);
  const status = normalizeText(req.body.status, 30).toLowerCase();
  const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) throw new ApiError(400, 'Invalid status value');
  const result = await db.query('UPDATE orders SET status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *', [status, id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Order not found');
  res.json(result.rows[0]);
}));

app.get('/api/admin/stats', requireAdminAuth, asyncHandler(async (req, res) => {
  const [products, orders, revenue, categories] = await Promise.all([
    db.query('SELECT COUNT(*) FROM products'),
    db.query('SELECT COUNT(*) FROM orders'),
    db.query("SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status != 'cancelled'"),
    db.query('SELECT COUNT(*) FROM categories'),
  ]);
  res.json({
    totalProducts: parseInt(products.rows[0].count),
    totalOrders: parseInt(orders.rows[0].count),
    totalRevenue: parseFloat(revenue.rows[0].total),
    totalCategories: parseInt(categories.rows[0].count),
  });
}));

//  404 / Error handlers 

if (process.env.NODE_ENV === 'production' && hasFrontendBuild) {
  app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found', requestId: req.requestId });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', requestId: req.requestId });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) {
    console.error('Server error', { requestId: req.requestId, message: error.message, stack: error.stack });
  }
  const payload = { error: statusCode >= 500 ? 'Internal server error' : error.message, requestId: req.requestId };
  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) payload.details = error.message;
  res.status(statusCode).json(payload);
});

app.listen(PORT, () => {
  console.log('Vayu Fashion API running on http://localhost:' + PORT);
});
