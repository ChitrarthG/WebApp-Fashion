const db = require('../src/db');

const statements = [
  'DROP TABLE IF EXISTS order_items CASCADE',
  'DROP TABLE IF EXISTS orders CASCADE',
  'DROP TABLE IF EXISTS cart_items CASCADE',
  'DROP TABLE IF EXISTS customer_accounts CASCADE',
  'DROP TABLE IF EXISTS users CASCADE',
  'DROP TABLE IF EXISTS products CASCADE',
  'DROP TABLE IF EXISTS categories CASCADE',

  `CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `INSERT INTO categories (name, slug, display_order) VALUES
    ('Women', 'women', 1),
    ('Men', 'men', 2),
    ('Kids', 'kids', 3),
    ('Beauty', 'beauty', 4),
    ('Home & Living', 'home-living', 5),
    ('Footwear', 'footwear', 6),
    ('Jewelry', 'jewelry', 7),
    ('Innerwear', 'innerwear', 8),
    ('Character Shop', 'character-shop', 9),
    ('Sale', 'sale', 10)`,

  `CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL,
    mrp NUMERIC(10,2),
    discount_pct INT DEFAULT 0,
    image_url TEXT,
    image_url_2 TEXT,
    brand VARCHAR(100),
    sizes TEXT[],
    colors TEXT[],
    stock INT DEFAULT 0,
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,1) DEFAULT 4.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  'CREATE INDEX idx_products_category ON products(category_id)',
  'CREATE INDEX idx_products_featured ON products(is_featured)',
  'CREATE INDEX idx_products_new ON products(is_new)',
  'CREATE INDEX idx_products_sale ON products(is_on_sale)',

  `INSERT INTO products (name, description, category_id, price, mrp, discount_pct, brand, sizes, colors, stock, is_new, is_featured, is_on_sale, rating, review_count) VALUES
    ('Floral Wrap Dress', 'Elegant floral print wrap dress, perfect for all occasions.', 1, 999, 1799, 44, 'Vayu Fashion', ARRAY['XS','S','M','L','XL'], ARRAY['Blue','Red','Green'], 50, TRUE, TRUE, FALSE, 4.5, 128),
    ('Embroidered Kurta Set', 'Beautiful embroidered kurta with matching palazzo.', 1, 1499, 2499, 40, 'Vayu Fashion', ARRAY['S','M','L','XL'], ARRAY['Pink','Yellow','White'], 40, TRUE, TRUE, FALSE, 4.3, 89),
    ('Slim Fit Chinos', 'Premium cotton slim-fit chinos for a smart casual look.', 2, 1299, 1999, 35, 'Vayu Fashion', ARRAY['28','30','32','34','36'], ARRAY['Khaki','Navy','Olive'], 60, FALSE, TRUE, FALSE, 4.4, 72),
    ('Graphic Print T-Shirt', 'Trendy graphic tee made from 100% soft cotton.', 2, 499, 999, 50, 'Vayu Fashion', ARRAY['S','M','L','XL','XXL'], ARRAY['White','Black','Grey'], 80, TRUE, FALSE, TRUE, 4.2, 45),
    ('Kids Dungaree Set', 'Adorable dungaree set with vibrant prints for active kids.', 3, 799, 1299, 38, 'Vayu Fashion', ARRAY['2Y','4Y','6Y','8Y','10Y'], ARRAY['Blue','Red'], 35, TRUE, TRUE, FALSE, 4.6, 56),
    ('Maxi Skirt', 'Flowy maxi skirt with elastic waistband, ideal for summer.', 1, 699, 1299, 46, 'Vayu Fashion', ARRAY['S','M','L','XL'], ARRAY['Floral','Striped'], 45, FALSE, FALSE, TRUE, 4.1, 34),
    ('Formal Oxford Shirt', 'Crisp cotton oxford shirt in classic white for formal occasions.', 2, 999, 1499, 33, 'Vayu Fashion', ARRAY['S','M','L','XL','XXL'], ARRAY['White','Blue','Pink'], 55, FALSE, TRUE, FALSE, 4.5, 91),
    ('Girl''s Lehenga Choli', 'Festive lehenga choli set for special occasions.', 3, 1999, 2999, 33, 'Vayu Fashion', ARRAY['3Y','5Y','7Y','9Y'], ARRAY['Red','Purple','Pink'], 20, TRUE, TRUE, FALSE, 4.7, 63),
    ('Jogger Track Pants', 'Comfortable jogger pants for everyday wear and workouts.', 2, 799, 1299, 38, 'Vayu Fashion', ARRAY['S','M','L','XL','XXL'], ARRAY['Navy','Black','Grey'], 70, FALSE, FALSE, TRUE, 4.0, 28),
    ('Anarkali Suit', 'Stunning Anarkali suit with intricate prints for festive wear.', 1, 2499, 3999, 37, 'Vayu Fashion', ARRAY['S','M','L','XL'], ARRAY['Maroon','Teal','Blue'], 25, TRUE, TRUE, FALSE, 4.8, 142)`,

  `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT,
    gender VARCHAR(10),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'India',
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  'CREATE INDEX idx_users_email ON users(email)',
  'CREATE INDEX idx_users_active ON users(is_active)',

  `CREATE TABLE customer_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    loyalty_points INT DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'silver' CHECK (tier IN ('bronze','silver','gold','platinum')),
    total_spent NUMERIC(12,2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    preferred_size VARCHAR(20),
    preferred_color VARCHAR(50),
    newsletter_subscribed BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  'CREATE INDEX idx_customer_accounts_user ON customer_accounts(user_id)',

  `CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(20),
    color VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  'CREATE INDEX idx_cart_session ON cart_items(session_id)',

  `CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
    payment_method VARCHAR(50) DEFAULT 'cod',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  'CREATE INDEX idx_orders_number ON orders(order_number)',
  'CREATE INDEX idx_orders_status ON orders(status)',
  'CREATE INDEX idx_orders_email ON orders(customer_email)',
  'CREATE INDEX idx_orders_user ON orders(user_id)',

  `CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL
  )`,

  'CREATE INDEX idx_order_items_order ON order_items(order_id)'
];

(async () => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    for (const sql of statements) {
      await client.query(sql);
    }
    await client.query('COMMIT');
    console.log('Database schema reset complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database reset failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.end();
  }
})();
